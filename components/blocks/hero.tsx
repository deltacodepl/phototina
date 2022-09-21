import * as React from "react";

import { Container } from "../util/container";
import { Section } from "../util/section";
import type { TinaTemplate } from "tinacms";
import { useTheme } from "../layout";
import { monoTextColors, primaryTextColors } from "../styles";

const Image = ({ data, parentField = "" }) => (
  <div
    className="flex flex-col items-center justify-center"
    data-tinafield={`${parentField}.image`}
  >
    <img
      className="object-cover object-center w-full"
      alt={data.image.alt}
      src={data.image.src ?? ""}
      width={data.image.type === "portrait" ? 1365 : 2048}
      height={data.image.type === "portrait" ? 2048 : 1365}
    />
  </div>
);

const renderHero = (data, parentField, color, mono) => {
  switch (data.type) {
    case "left":
      return (
        <>
          <Container>
            <div className="flex flex-wrap items-center mx-auto 2xl:max-w-7xl">
              <div className="flex flex-col items-start mb-16 text-left lg:flex-grow lg:w-1/2 lg:pr-24 md:mb-0">
                {data.tagline && (
                  <span
                    className={`mb-8 text-xs font-bold tracking-widest uppercase  ${primaryTextColors[color]}`}
                    data-tinafield={`${parentField}.tagline`}
                  >
                    {data.tagline}
                  </span>
                )}
                {data.headline && (
                  <h1
                    className={`mb-8 text-4xl font-bold leading-none tracking-tighter ${monoTextColors[700][mono]} md:text-7xl`}
                    data-tinafield={`${parentField}.headline`}
                  >
                    {data.headline}
                  </h1>
                )}
                {data.text && (
                  <p
                    className={`mb-8 text-base leading-relaxed text-left ${monoTextColors[500][mono]}`}
                    data-tinafield={`${parentField}.text`}
                  >
                    {data.text}
                  </p>
                )}
              </div>
            </div>
          </Container>
          {data.image?.src && (
            <Container>
              <Image data={data} parentField={parentField} />
            </Container>
          )}
        </>
      );
    case "center":
      return (
        <>
          <Container>
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
              <div className="flex flex-col w-full mb-12 text-center">
                {data.headline && (
                  <h1
                    className={`max-w-5xl text-2xl font-bold leading-none tracking-tighter ${monoTextColors[700][mono]} md:text-5xl lg:text-6xl lg:max-w-7xl`}
                    data-tinafield={`${parentField}.headline`}
                  >
                    {data.headline}
                  </h1>
                )}
                {data.text && (
                  <p
                    className={`max-w-xl mx-auto mt-8 text-base leading-relaxed text-center ${monoTextColors[500][mono]}`}
                    data-tinafield={`${parentField}.text`}
                  >
                    {data.text}
                  </p>
                )}
              </div>
            </div>
          </Container>{" "}
          {data.image?.src && (
            <Container>
              <Image data={data} parentField={parentField} />
            </Container>
          )}
        </>
      );
    default:
      return null;
  }
};

export const Hero = ({ data, parentField = "" }) => {
  const { color, mono } = useTheme();
  return <Section>{renderHero(data, parentField, color, mono)}</Section>;
};

export const heroBlockSchema: TinaTemplate = {
  name: "hero",
  label: "Hero",
  ui: {
    previewSrc: "",
    defaultItem: {
      tagline: "Your tagline",
      headline: "This Big Text is Totally Awesome",
      text: "Here's some text above the other text",
      type: "left",
    },
  },
  fields: [
    {
      name: "tagline",
      label: "Tagline",
      type: "string",
    },
    {
      type: "string",
      label: "Headline",
      name: "headline",
    },
    {
      type: "string",
      label: "Text",
      name: "text",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      label: "Type",
      name: "type",
      options: ["left", "center"],
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
      ],
    },
  ],
};
