import React from "react";
import { Navbar } from "./Navbar";
import { Card } from "./Card";
import { Crear } from "./Crear";

export default function Home() {
  return (
    <>
      <div>
        <Navbar />
        <Card />
        <Crear />
      </div>
    </>
  );
}
