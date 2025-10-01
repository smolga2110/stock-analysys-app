import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Link } from "@heroui/link";
import { User } from "@heroui/user"

export default function DocsPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-40 items-center justify-center">
        <User
          avatarProps={{
            src: "https://i.pinimg.com/736x/44/45/10/4445104f092c19feabdd1d6f8221d0c0.jpg",
            className: "w-30 h-30"
          }}
          description={
            <Link isExternal href="https://github.com/smolga2110" size="lg">
              @smolga2110
            </Link>
          }
          name="Artem Mazenin"
          classNames={{
            name: "text-2xl font-bold"
          }}
        />
        <div className="flex flex-col text-center">
          <h1 className={title()}>About this APP:</h1>
          <span className={subtitle()}>GInvest is an application that allows the user not to spend his precious time on analyzing the market situation, 
          instead he trusts his portfolio to our algorithms based on Benjamin Graham's value investing. 
          The algorithms offer the best options in the stock market, and the user only has to make the final choice</span>
          <span className={subtitle()}>(*Not a real photo*)</span>
        </div>
      </div>
    </DefaultLayout>
  );
}
