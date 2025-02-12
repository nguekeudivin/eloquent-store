"use client";

import Statistics from "@/components/home/Statistics";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import clsx from "clsx";
import { useEffect, useState } from "react";

const carouselItems = [
  {
    label: "Featured App",
    title: "Mental Health in the Digital Age: Navigation",
    description: " Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    image: "/images/image.png",
  },
  {
    label: "New features",
    title: "We have added new features to the application",
    description: " Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    image: "/images/image.png",
  },
  {
    label: "Bugs fixed",
    title: "We have fixed a lot of bugs present into the application",
    description: " Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    image: "/images/image.png",
  },
];

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <section className="grid grid-cols-3 gap-8">
        <div
          className="rounded-xl col-span-2"
          style={{ backgroundImage: `url(/images/image.png)` }}
        >
          <div className="bg-gray-900/90 p-8 py-12  rounded-xl flex items-center">
            <div className="flex items-center justify-between text-white">
              <div className="w-3/5">
                <h3 className="text-3xl font-semibold">
                  Welcome back 👋 <br /> Jaydon Frankie
                </h3>
                <h4 className="mt-4 text-lg text-gray-300">
                  If you are going to use a passage of Lorem Ipsum, you need to
                  be sure there isn't anything
                </h4>
                <Button className="mt-6 text-white"> Go now </Button>
              </div>
              <div className="w-2/5"></div>
            </div>
          </div>
        </div>

        <div className="h-full">
          <Carousel setApi={setApi} className="h-full">
            <CarouselContent className="h-full">
              {carouselItems.map((item) => (
                <CarouselItem className="h-full">
                  <div
                    style={{ backgroundImage: `url(${item.image})` }}
                    className="h-full bg-cover rounded-xl"
                  >
                    <div className="bg-gray-900/80 h-full rounded-xl relative">
                      <div className="absolute bottom-4 p-4">
                        <h3 className="text-lg text-green-500  uppercase">
                          {item.label}
                        </h3>
                        <h3 className="text-xl text-white">{item.title}</h3>
                        <h4 className="mt-2 text-sm text-gray-300">
                          {item.description}
                        </h4>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-4 left-4 flex gap-2">
              {carouselItems.map((item, index) => (
                <div
                  onClick={() => {
                    console.log("set current");
                    if (api) setCurrent(api.selectedScrollSnap());
                  }}
                  className={clsx("w-3 h-3 rounded-full ", {
                    "bg-green-600": index == current,
                    "bg-green-800/50": index != current,
                  })}
                ></div>
              ))}
            </div>
            <CarouselNext className="top-2 right-2 text-white bg-gray-800 border-none" />
            <CarouselPrevious className="top-2 right-12 bg-gray-800 border-none text-white" />
          </Carousel>
        </div>
      </section>

      <section className="mt-8">
        <Statistics />
      </section>
    </>
  );
}
