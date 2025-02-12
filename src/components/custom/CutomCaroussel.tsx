import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export function CustomCaroussel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem className="bg-red-500 ">
          <div>Carousel 1 b</div>
        </CarouselItem>
        <CarouselItem className="bg-green-500"> Carousel 2</CarouselItem>
        <CarouselItem className="bg-yellow-500"> Carousel 3</CarouselItem>
      </CarouselContent>
      <CarouselNext className="top-0 right-0" />
      <CarouselPrevious className="top-0 right-12" />
    </Carousel>
  );
}
