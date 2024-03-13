import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { lusitana } from './ui/fonts';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <div className="flex h-screen w-full flex-col items-center justify-center xl:flex-row xl:gap-3">
        <div className="flex h-full w-full flex-1 justify-center rounded-lg pb-6  lg:items-center xl:px-6">
          <div className="flex h-full w-[85%] flex-col justify-center gap-6 lg:h-full 2xl:w-[70%]">
            <div className="w-full items-center justify-center sm:flex  md:px-28 xl:hidden xl:p-6 xl:py-12">
              <Image
                src="/background-landing-page.png"
                width={800}
                height={760}
                className="xl:hidden"
                alt="Screenshots of the dashboard project showing desktop version"
              />
            </div>
            <div className="row-span-2">
              <strong
                className={`${lusitana.className} mt-[-20px] text-[16px] xl:text-[40px]`}
              >
                <p className="text-center">
                  Welcome to finance dashboard project !!
                </p>
              </strong>

              <span className="text-[13px]  xl:text-[18px]">
                <p className="text-center">
                  สวัสดีครับ, ขอบคุณที่เข้ามาเยี่ยมชม
                </p>
              </span>
              <div className="mt-5 flex w-full justify-center xl:mt-10">
                <Link
                  href="/dashboard"
                  className="mt-3 flex w-[150px] items-center gap-3 rounded-lg bg-gray-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 md:text-base"
                >
                  <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
                </Link>
              </div>

              <div className="mt-5 flex w-full justify-center">
                <p className="text-center text-[10px] text-gray-600 xl:text-[11px]">
                  You can see the instructions for access at the{' '}
                  <Link
                    href="https://github.com/Aidogpon/nextjs-financial-dashboard"
                    className="text-blue-400"
                  >
                    Github-repository
                  </Link>{' '}
                  to visit.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden items-center justify-center md:w-3/5 md:px-20 md:py-12 lg:p-6 xl:flex">
          <Image
            src="/background-landing-page.png"
            width={800}
            height={760}
            className="hidden lg:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
  );
}
