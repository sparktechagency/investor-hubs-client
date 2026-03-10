"use client";

import { useSearchParams } from "next/navigation";

export const useGetSearchParams = () => {
  const searchParams = useSearchParams();

  // Convert URLSearchParams to a plain object
  const paramsObject = Object.fromEntries(searchParams.entries());

  return paramsObject;
};