import { defineSchema, defineConfig, RouteMappingPlugin } from "tinacms";
import { contentBlockSchema } from "../components/blocks/content";
import {
  heroBlockSchema,
  featuredBlockSchema,
  latestsBlockSchema,
} from "../components/blocks";
import { iconSchema } from "../components/util/icon";

import { client } from "./__generated__/client";
import { kebabParser } from "../lib/utils";

const kodak = [
  "Kodak",
  "Kodak Portra 400",
  "Kodak Portra 160",
  "Kodak Portra 800",
  "Kodak Ektra 100",
  "Kodak Gold 100",
  "Kodak Gold 200",
  "Kodak Ultramax 400",
  "Kodak Pro Image 100",
  "Kodak T-Max 400",
];
const fuji = ["Fujifilm", "Fujifilm Superia 400", "Fujifilm C200"];
const cineStill = ["CineStill", "CineStill 800T"];
const ilford = [
  "Ilford",
  "Ilford HP5 400",
  "Ilford Delta 3200",
  "Ilford XP2 400",
];
export const series = [...kodak, ...fuji, ...cineStill, ...ilford].map(
  (value) => kebabParser(value)
);

const schema = defineSchema({
  config: {
    clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
    branch:
      process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
      process.env.HEAD!, // Netlify branch env
    token: process.env.TINA_TOKEN!,
    media: {
      // If you wanted cloudinary do this
      // loadCustomStore: async () => {
      //   const pack = await import("next-tinacms-cloudinary");
      //   return pack.TinaCloudCloudinaryMediaStore;
      // },
      // this is the config for the tina cloud media store
      tina: {
        publicFolder: "public",
        mediaRoot: "uploads",
      },
    },
  },
  collections: [
    {
      label: "Series",
      name: "serie",
      path: "content/series",
      format: "mdx",
      fields: [
        {
          label: "Title",
          name: "title",
          type: "string",
          ui: {
            defaultValue: "Untitled",
          },
        },

        {
          label: "Camera",
          name: "camera",
          type: "string",
          options: [
            "Canon EOS Elan",
            "Canon EOS 50 E",
            "Canon EOS 33",
            "Canon EOS 50D",
            "Canon EOS 6D",
          ],
          ui: {
            defaultValue: "Canon EOS 50 E",
          },
        },
        {
          label: "Film",
          name: "film",
          type: "string",
          options: [
            "Kodak Gold 200",
            "Kodak Portra 400",
            "Kodak Ektar 100",
            "Ilford Delta 3200",
            "Ilford HP5 Plus 400",
            "Ilford XP2 Super 400",
            "Fujifilm C200",
            "Fujifilm Superia 400",
          ],
          ui: {
            defaultValue: "Kodak Gold 200",
          },
        },
        {
          type: "object",
          label: "Shot Period",
          name: "shot",
          fields: [
            {
              label: "Start",
              name: "start",
              type: "datetime",
              ui: {
                dateFormat: "MMMM DD YYYY",
                timeFormat: "HH:mm",
              },
            },
            {
              label: "End",
              name: "end",
              type: "datetime",
              ui: {
                dateFormat: "MMMM DD YYYY",
                timeFormat: "HH:mm",
              },
            },
          ],
        },
        {
          label: "Location",
          name: "location",
          type: "object",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: `${item?.name}, ${item?.country}` };
            },
            defaultItem: {
              name: "Name",
              country: "Country",
            },
          },
          fields: [
            {
              label: "Name",
              name: "name",
              type: "string",
            },
            {
              label: "Country",
              name: "country",
              type: "string",
            },
          ],
        },
        {
          type: "image",
          name: "cover",
          label: "Cover",
        },
        {
          type: "rich-text",
          label: "Body",
          name: "_body",
          templates: [
            {
              name: "DateTime",
              label: "Date & Time",
              inline: true,
              fields: [
                {
                  name: "format",
                  label: "Format",
                  type: "string",
                  options: ["utc", "iso", "local"],
                },
              ],
            },
            {
              name: "BlockQuote",
              label: "Block Quote",
              fields: [
                {
                  name: "children",
                  label: "Quote",
                  type: "rich-text",
                },
                {
                  name: "authorName",
                  label: "Author",
                  type: "string",
                },
              ],
            },
          ],
          isBody: true,
        },
        {
          label: "Tags",
          name: "tags",
          type: "object",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.label };
            },
            defaultItem: {
              label: "tag",
            },
          },
          fields: [
            {
              type: "string",
              label: "Label",
              name: "label",
              options: series,
            },
          ],
        },
        {
          type: "datetime",
          label: "Published At",
          name: "publishedAt",
          ui: {
            dateFormat: "MMMM DD YYYY",
            timeFormat: "hh:mm A",
          },
        },
        {
          type: "boolean",
          label: "Is Featured",
          name: "isFeatured",
        },
        {
          type: "boolean",
          label: "Is Published",
          name: "isPublished",
        },
      ],
    },
    {
      label: "Global",
      name: "global",
      path: "content/global",
      format: "json",
      fields: [
        {
          type: "object",
          label: "Header",
          name: "header",
          fields: [
            { ...iconSchema, label: "Icon Menu", name: "iconMenu" },
            { ...iconSchema, label: "Icon Close", name: "iconClose" },
            {
              type: "string",
              label: "Color",
              name: "color",
              options: [
                { label: "Default", value: "default" },
                { label: "Primary", value: "primary" },
              ],
            },
            {
              type: "object",
              label: "Nav Links",
              name: "nav",
              list: true,
              ui: {
                itemProps: (item) => {
                  return { label: item?.label };
                },
                defaultItem: {
                  href: "home",
                  label: "Home",
                },
              },
              fields: [
                {
                  type: "string",
                  label: "Link",
                  name: "href",
                },
                {
                  type: "string",
                  label: "Label",
                  name: "label",
                },
              ],
            },
          ],
        },
        {
          type: "object",
          label: "Footer",
          name: "footer",
          fields: [
            {
              type: "string",
              label: "Color",
              name: "color",
              options: [
                { label: "Default", value: "default" },
                { label: "Primary", value: "primary" },
              ],
            },
            {
              type: "object",
              label: "Links",
              name: "links",
              list: true,
              ui: {
                itemProps: (item) => {
                  return { label: item?.label };
                },
                defaultItem: {
                  href: "",
                  label: "Home",
                },
              },
              fields: [
                {
                  type: "string",
                  label: "Link",
                  name: "href",
                },
                {
                  type: "string",
                  label: "Label",
                  name: "label",
                },
              ],
            },
            {
              type: "object",
              label: "Social Links",
              name: "social",
              list: true,
              ui: {
                itemProps: (item) => {
                  return { label: item?.label };
                },
                defaultItem: {
                  href: "/",
                  label: "Twitter",
                },
              },
              fields: [
                {
                  type: "string",
                  label: "Link",
                  name: "href",
                },
                {
                  type: "string",
                  label: "Label",
                  name: "label",
                },
              ],
            },
          ],
        },
        {
          type: "object",
          label: "Theme",
          name: "theme",
          fields: [
            {
              type: "string",
              label: "Primary Color",
              name: "color",
              options: [
                {
                  label: "Default",
                  value: "default",
                },
                {
                  label: "Red",
                  value: "red",
                },
                {
                  label: "Orange",
                  value: "orange",
                },
                {
                  label: "Amber",
                  value: "amber",
                },
                {
                  label: "Yellow",
                  value: "yellow",
                },
                {
                  value: "lime",
                  label: "Lime",
                },
                {
                  label: "Green",
                  value: "green",
                },
                {
                  label: "Emerald",
                  value: "emerald",
                },
                {
                  label: "Teal",
                  value: "teal",
                },
                {
                  label: "Cyan",
                  value: "cyan",
                },
                {
                  label: "Sky",
                  value: "sky",
                },
                {
                  label: "Blue",
                  value: "blue",
                },
                {
                  label: "Indigo",
                  value: "indigo",
                },
                {
                  label: "Violet",
                  value: "violet",
                },

                {
                  label: "Purple",
                  value: "purple",
                },
                {
                  label: "Fuchsia",
                  value: "fuchsia",
                },
                {
                  label: "Pink",
                  value: "pink",
                },
                {
                  label: "Rose",
                  value: "rose",
                },
                {
                  label: "Slate",
                  value: "slate",
                },
                {
                  label: "Gray",
                  value: "gray",
                },
                {
                  label: "Zinc",
                  value: "zinc",
                },
                {
                  label: "Neutral",
                  value: "neutral",
                },
                {
                  label: "Stone",
                  value: "stone",
                },
              ],
            },
            {
              type: "string",
              name: "font",
              label: "Font Family",
              options: [
                {
                  label: "System Sans",
                  value: "sans",
                },
                {
                  label: "Nunito",
                  value: "nunito",
                },
                {
                  label: "Lato",
                  value: "lato",
                },
                {
                  label: "Work Sans",
                  value: "work-sans",
                },
              ],
            },
            {
              type: "string",
              name: "icon",
              label: "Icon Set",
              options: [
                {
                  label: "Heroicons",
                  value: "heroicon",
                },
              ],
            },
            {
              type: "string",
              name: "darkMode",
              label: "Dark Mode",
              options: [
                {
                  label: "System",
                  value: "system",
                },
                {
                  label: "Light",
                  value: "light",
                },
                {
                  label: "Dark",
                  value: "dark",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Pages",
      name: "page",
      path: "content/pages",
      format: "mdx",
      fields: [
        {
          type: "object",
          list: true,
          name: "blocks",
          label: "Sections",
          ui: {
            visualSelector: true,
          },
          templates: [
            heroBlockSchema,
            featuredBlockSchema,
            latestsBlockSchema,
            contentBlockSchema,
          ],
        },
      ],
    },
  ],
});

export const tinaConfig = defineConfig({
  client,
  schema,

  cmsCallback: (cms) => {
    /**
     * When `tina-admin` is enabled, this plugin configures contextual editing for collections
     */
    const RouteMapping = new RouteMappingPlugin((collection, document) => {
      if (["global"].includes(collection.name)) {
        return undefined;
      }
      if (["page"].includes(collection.name)) {
        if (document._sys.filename === "home") {
          return `/`;
        }
        if (document._sys.filename === "about") {
          return `/about`;
        }
        if (document._sys.filename === "series") {
          return `/series`;
        }
        return undefined;
      }
      return `/${collection.name}/${document._sys.filename}`;
    });
    cms.plugins.add(RouteMapping);

    return cms;
  },
  formifyCallback: ({ formConfig, createForm, createGlobalForm }) => {
    if (formConfig.id === "content/global/index.json") {
      return createGlobalForm(formConfig);
    }

    return createForm(formConfig);
  },
});

export default schema;
