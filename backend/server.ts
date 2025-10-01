import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const app: Express = express();
const PORT = process.env.PORT || 3001;

const ALPHA_VANTAGE_API_KEY = '4QFTBYVKSVLIY9PR';

// Middleware
app.use(cors());
app.use(express.json());

// Список тикеров NASDAQ-100 для анализа
const NASDAQ_100_TICKERS = [
  "AAPL", "MSFT", "AMZN", "NVDA", "GOOGL", "GOOG", "META", "TSLA", "AVGO", "COST",
  "PEP", "ADBE", "CSCO", "TMUS", "CMCSA", "NFLX", "HON", "AMD", "TXN", "QCOM",
  "INTU", "AMGN", "INTC", "SBUX", "GILD", "MDLZ", "VRTX", "ADP", "ISRG", "REGN",
  "PANW", "PYPL", "AMAT", "LRCX", "BKNG", "MU", "SNPS", "CDNS", "KLAC", "MAR",
  "MELI", "CTAS", "CSX", "ASML", "CRWD", "ORLY", "MNST", "FTNT", "CHTR", "ADSK",
  "KDP", "KHC", "NXPI", "AEP", "PDD", "DXCM", "EXC", "MCHP", "XEL", "BIIB",
  "IDXX", "WDAY", "ROST", "ODFL", "PCAR", "LULU", "PAYX", "DLTR", "WBD", "CTSH",
  "FAST", "VRSK", "EA", "SGEN", "ANSS", "CPRT", "SIRI", "DDOG", "ALGN", "TEAM",
  "ZS", "BKR", "FANG", "CEG", "MTCH", "VRSN", "TTD", "OKTA", "GFS", "SWKS",
  "CDW", "MRNA", "SPLK", "ILMN", "AXON", "NTES", "JD", "LCID", "RIVN", "EBAY",
  "WBA", "VOD", "RYAAY", "UAL"
];

// Функция для задержки между запросами
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Функция анализа одной акции
const analyzeStock = async (ticker: string) => {
  try {
    console.log(`Анализируем ${ticker}...`);

    // Получение общей информации
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const overviewResponse = await axios.get(overviewUrl);
    const overview = overviewResponse.data;

    // Проверяем, есть ли данные по акции
    if (Object.keys(overview).length === 0 || overview.Note) {
      console.log(`Пропускаем ${ticker}: нет данных или лимит API`);
      return null;
    }

    // Получение последней цены
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const quoteResponse = await axios.get(quoteUrl);
    const quote = quoteResponse.data['Global Quote'];

    // Получение балансового отчета
    const balanceUrl = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const balanceResponse = await axios.get(balanceUrl);
    const balance = balanceResponse.data.annualReports?.[0];

    // Получение отчета о денежных потоках
    const flowUrl = `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const flowResponse = await axios.get(flowUrl);
    const flow = flowResponse.data.annualReports?.[0];

    // Если нет необходимых данных, пропускаем акцию
    if (!balance || !flow || !quote) {
      console.log(`Пропускаем ${ticker}: недостаточно данных`);
      return null;
    }

    // Извлекаем нужные данные
    const eps = parseFloat(overview.DilutedEPSTTM) || 0;
    const bookValuePerShare = parseFloat(overview.BookValue) || 0;
    const currentPrice = parseFloat(quote['05. price']) || 0;
    const sharesOutstanding = parseFloat(overview.SharesOutstanding) || 0;

    // Из баланса
    const totalDebt = parseFloat(balance.totalLiabilities) || 0;
    const totalEquity = parseFloat(balance.totalShareholderEquity) || 0;
    const currentAssets = parseFloat(balance.totalCurrentAssets) || 0;
    const currentLiab = parseFloat(balance.totalCurrentLiabilities) || 0;

    // Из отчета о денежных потоках
    const opCashFlow = parseFloat(flow.operatingCashflow) || 0;
    const capEx = Math.abs(parseFloat(flow.capitalExpenditures)) || 0;

    // Расчет производных показателей
    const debtToEquity = totalEquity !== 0 ? totalDebt / totalEquity : 0;
    const currentRatio = currentLiab !== 0 ? currentAssets / currentLiab : 0;
    const freeCashFlow = opCashFlow - capEx;
    const fcfPerShare = sharesOutstanding !== 0 ? freeCashFlow / sharesOutstanding : 0;
    const priceToFcfRatio = fcfPerShare !== 0 ? currentPrice / fcfPerShare : 0;

    // Расчет формулы Грэхема и маржи безопасности
    const grahamValue = Math.sqrt(22.5 * eps * bookValuePerShare) || 0;
    const marginOfSafety = grahamValue !== 0 ? ((grahamValue - currentPrice) / grahamValue) * 100 : 0;
    const isMarginSafe = marginOfSafety >= 25;

    // Стадия 1: Быстрый скрининг
    const quickScreening = {
      passed: true,
      criteria: {
        marketCap: {
          value: parseFloat(overview.MarketCapitalization) || 0,
          passed: (parseFloat(overview.MarketCapitalization) || 0) > 2000000000
        },
        peRatio: {
          value: parseFloat(overview.PERatio) || 0,
          passed: (parseFloat(overview.PERatio) || 0) > 0 && (parseFloat(overview.PERatio) || 0) < 20
        },
        pbRatio: {
          value: parseFloat(overview.PriceToBookRatio) || 0,
          passed: (parseFloat(overview.PriceToBookRatio) || 0) < 2.5
        },
        roe: {
          value: (parseFloat(overview.ReturnOnEquityTTM) || 0) * 100,
          passed: (parseFloat(overview.ReturnOnEquityTTM) || 0) > 0.08
        }
      }
    };
    
    quickScreening.passed = Object.values(quickScreening.criteria).every(criterion => criterion.passed);

    // Стадия 2: Финансовая устойчивость
    const financialHealth = {
      passed: true,
      criteria: {
        debtToEquity: {
          value: debtToEquity,
          passed: debtToEquity < 0.5
        },
        currentRatio: {
          value: currentRatio,
          passed: currentRatio > 1.5
        },
        priceToFcf: {
          value: priceToFcfRatio,
          passed: priceToFcfRatio < 20
        }
      }
    };
    
    financialHealth.passed = Object.values(financialHealth.criteria).every(criterion => criterion.passed);

    // Стадия 3: Оценка стоимости
    const valuation = {
      passed: isMarginSafe,
      criteria: {
        grahamIntrinsicValue: grahamValue,
        currentPrice: currentPrice,
        marginOfSafety: marginOfSafety,
        marginOfSafetyRequired: 25,
        isMarginSafe: isMarginSafe
      }
    };

    // Общий вердикт
    const overallVerdict = quickScreening.passed && financialHealth.passed && valuation.passed;

    return {
      ticker,
      companyName: overview.Name || ticker,
      currentPrice,
      overallVerdict,
      stages: {
        quickScreening,
        financialHealth, 
        valuation
      },
      calculatedMetrics: {
        debtToEquity,
        currentRatio,
        freeCashFlow,
        fcfPerShare,
        priceToFcfRatio,
        eps,
        bookValuePerShare
      },
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Ошибка при анализе ${ticker}:`, errorMessage);
    return null;
  }
};

// Маршрут для массового анализа акций
app.get('/api/analyze-nasdaq100', async (req: Request, res: Response) => {
  try {
    const results: any[] = [];
    const failedTickers: string[] = [];

    for (let i = 0; i < NASDAQ_100_TICKERS.length; i++) {
      const ticker = NASDAQ_100_TICKERS[i];

      if (!ticker) continue;
      
      const result = await analyzeStock(ticker);
      
      if (result) {
        results.push(result);
        console.log(`✅ ${ticker} проанализирован (${i + 1}/${NASDAQ_100_TICKERS.length})`);
      } else {
        failedTickers.push(ticker);
        console.log(`❌ ${ticker} не удалось проанализировать`);
      }

      // Задержка 15 секунд между запросами (для бесплатного тарифа Alpha Vantage)
      if (i < NASDAQ_100_TICKERS.length - 1) {
        await delay(15000);
      }
    }

    // Создаем финальный объект с результатами
    const analysisResult = {
      analysisDate: new Date().toISOString(),
      totalAnalyzed: results.length,
      successRate: (results.length / NASDAQ_100_TICKERS.length) * 100,
      stocks: results,
      failedTickers: failedTickers,
      summary: {
        passedAllStages: results.filter(stock => stock.overallVerdict).length,
        passedQuickScreening: results.filter(stock => stock.stages.quickScreening.passed).length,
        passedFinancialHealth: results.filter(stock => stock.stages.financialHealth.passed).length,
        passedValuation: results.filter(stock => stock.stages.valuation.passed).length
      }
    };

    // Сохраняем результаты в JSON файл
    const filePath = path.join(__dirname, 'nasdaq100-analysis.json');
    fs.writeFileSync(filePath, JSON.stringify(analysisResult, null, 2), 'utf8');

    console.log(`✅ Анализ завершен! Результаты сохранены в nasdaq100-analysis.json`);
    console.log(`📊 Статистика: ${analysisResult.summary.passedAllStages} из ${analysisResult.totalAnalyzed} акций соответствуют критериям`);

    res.json({
      message: 'Анализ завершен',
      totalAnalyzed: analysisResult.totalAnalyzed,
      successRate: analysisResult.successRate.toFixed(2),
      filePath: filePath
    });

  } catch (error) {
    console.error('Ошибка при массовом анализе:', error);
    res.status(500).json({ error: 'Failed to analyze stocks' });
  }
});

// Маршрут для получения сохраненных результатов
app.get('/api/results', (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, 'nasdaq100-analysis.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'Results not found. Run analysis first.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read results' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Для запуска анализа перейдите по: http://localhost:${PORT}/api/analyze-nasdaq100`);
  console.log(`Для получения результатов: http://localhost:${PORT}/api/results`);
});