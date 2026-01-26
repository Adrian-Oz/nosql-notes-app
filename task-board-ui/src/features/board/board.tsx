// const columns = [
//   {
//     title: "Col",
//   },
//   {
//     title: "Col",
//   },
//   {
//     title: "Col",
//   },
//   {
//     title: "Col",
//   },

import { Button } from "@/components/ui/button";
import { CircleDotIcon, Ellipsis, Squircle } from "lucide-react";

// ];
export default function Board() {
  return (
    <section className="flex gap-4 h-full p-4 overflow-x-auto overflow-y-hidden">
      {/* {columns.map((item) => (
          <div
            key={item.title}
            className="h-full w-1/4 bg-black/10 rounded-md p-2"
          >
            {" "}
            {item.title}
          </div>
        ))} */}
      <BoardColumn />
      <BoardColumn />
      <BoardColumn />
    </section>
  );
}

function BoardColumn() {
  return (
    <div className="h-full min-w-80 max-w-80 rounded-md p-2 border flex flex-col gap-2  ">
      <div className="w-full flex items-center p-2 justify-between">
        <div className="flex gap-1 items-center">
          <Squircle />
          <p className="text-xl">Column</p>
        </div>
        <Button variant={"ghost"}>
          <Ellipsis />
        </Button>
      </div>
      <div className="min-h-0 flex-1 flex gap-2 p-2 flex-col overflow-y-auto">
        <BoardIssue />
        <BoardIssue />
      </div>
    </div>
  );
}

function BoardIssue() {
  return (
    <div className="bg-black/15 h-36 w-full  flex flex-col rounded-md border p-4">
      <div className="w-full flex items-center gap-2 text-primary/60 ">
        <div className="flex gap-0.5 items-center">
          <CircleDotIcon size={12} />
          <p className="text-sm">Issue title</p>
        </div>
        <Button size={"sm"} variant={"ghost"}>
          <Ellipsis />
        </Button>
      </div>
      <div className="p-2 border rounded-md h-full items-center flex justify-center">
        Body
      </div>
    </div>
  );
}
