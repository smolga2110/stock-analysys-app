import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import InfiniteLogoCarousel from "@/components/InfiniteLogoCarousel";
import { Card, CardHeader, CardFooter } from "@heroui/card"
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <BackgroundBlobs
        leftBlobSrc="/left-bottom.png"
        rightBlobSrc="/right-top.png"
      />
      <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
        <div className="flex flex-col items-center justify-center gap-8">
          <video autoPlay loop muted>
            <source src="/base.mp4"/>
          </video>
        </div>
        <div className="inline-block text-center justify-center">
          <span className={title()}>More than&nbsp;</span>
          <span className={title({ color: "violet" })}>100+&nbsp;</span>
          <span className={title()}>companies data</span>
        </div>
        <InfiniteLogoCarousel/>

        <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start!">
          <p className="text-tiny text-white/60 uppercase font-bold">What to read</p>
          <h4 className="text-white font-medium text-large">Financial best sellers</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://i.pinimg.com/736x/8d/7e/ee/8d7eeee02ca7179925e148eafbc4677a.jpg"
        />
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start!">
          <p className="text-tiny text-white/60 uppercase font-bold">Pack the garbage</p>
          <h4 className="text-white font-medium text-large">Save your wealth</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://i.pinimg.com/736x/76/45/5b/76455bac42a2473c044d9d1fd15d287b.jpg"
        />
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start!">
          <p className="text-tiny text-white/60 uppercase font-bold">Supercharged</p>
          <h4 className="text-white font-medium text-large">Motivational Blog</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://i.pinimg.com/736x/61/b1/28/61b12821668ea7ca6c960744d14e9b93.jpg"
        />
      </Card>
      <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-black/60 uppercase font-bold">New</p>
          <h4 className="text-black font-medium text-2xl">Platinum card</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src="https://i.pinimg.com/1200x/5a/93/d9/5a93d93d433bcd28653221c2721b1365.jpg"
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">Available soon.</p>
            <p className="text-black text-tiny">Get notified.</p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Notify Me
          </Button>
        </CardFooter>
      </Card>
      <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">Your life your way</p>
          <h4 className="text-white/90 font-medium text-xl">New trading app soon</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src="https://i.pinimg.com/1200x/9b/07/51/9b0751c2ce3b411bba2916cab3f8d9bf.jpg"
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://i.pinimg.com/736x/63/b2/fe/63b2fe46acc1a25d5c721252dcc6285e.jpg"
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Trading App</p>
              <p className="text-tiny text-white/60">Get a good life&#39;s income.</p>
            </div>
          </div>
          <Button radius="full" size="sm">
            Get App
          </Button>
        </CardFooter>
      </Card>
    </div>
        
        <div className="inline-block max-w-1920 text-center justify-center">
          <span className={title()}>Not a speculator,</span>
          <span className={title()}>but an&nbsp;</span>
          <span className={title({ color: "yellow" })}>owner</span>
          <br />
          <span className={title()}>Not for a day,</span>
          <span className={title()}>but for&nbsp;</span>
          <span className={title({ color: "yellow" })}>years</span>
          <div className={subtitle({ class: "mt-4" })}>
            Evaluation, cost, reliability.
          </div>
        </div>
        
      </section>
    </DefaultLayout>
  );
}
