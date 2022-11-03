/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../.tina/__generated__/client";
import { useTina } from "tinacms/dist/edit-state";
import { Layout, useTheme } from "../../components/layout";

import FourOhFour from "../404";

import { motion } from "framer-motion";
import { Lightbox, useLightbox } from "../../components/layout/lightbox";
import { NextSeoProps } from "next-seo";
import { HeroSerie, Masonry } from "../../components/blocks";
import { Section } from "../../components/util/section";
import { Image } from "../../components/util/image";
import { SocialShare } from "../../components/layout/social-share";
import { FC, useEffect } from "react";
import { Container } from "../../components/util/container";
import { monoRestColors, monoTextColors } from "../../components/styles";
import Link from "next/link";

type Pagination = {
  title: string;
  route: string;
};

const Pagination: FC<{
  prev?: Pagination | null;
  next?: Pagination | null;
}> = ({ next, prev }) => {
  const { mono } = useTheme();
  return (
    <Container className="grid grid-cols-2 gap-5">
      <div className="text-left group">
        {prev && (
          <>
            <h4
              className={`text-xs tracking-wide italic ${monoTextColors[500][mono]}`}
            >
              Anterior
            </h4>
            <Link href={prev.route} passHref>
              <a
                className={`line-clamp-1 max-w-xs mr-auto ${monoTextColors[600][mono]} ${monoRestColors.groupTextHover800[mono]}`}
              >
                {prev.title}
              </a>
            </Link>
          </>
        )}
      </div>

      <div className="text-right group">
        {next && (
          <>
            <h4
              className={`text-xs tracking-wide italic ${monoTextColors[500][mono]}`}
            >
              Siguiente
            </h4>

            <Link href={`${next.route}`} passHref>
              <a
                className={`line-clamp-1 max-w-xs ml-auto ${monoTextColors[600][mono]} ${monoRestColors.groupTextHover800[mono]}`}
              >
                {next.title}
              </a>
            </Link>
          </>
        )}
      </div>
    </Container>
  );
};

const WrapperMasonry = ({ masonry }: { masonry: any }) => {
  const { setIndex, setSlides } = useLightbox();

  useEffect(() => {
    if (masonry) {
      const images = masonry.images?.map((img, index) => {
        return {
          src: img.url,
          index,
        };
      });
      setSlides(images);
    }
  }, [masonry]);
  return (
    <Masonry
      data={{
        columns: masonry?.columns,
        gap: masonry?.gap,
      }}
    >
      {masonry?.images?.map(({ ...imageProps }, i) => {
        return <Image key={i} {...imageProps} onClick={() => setIndex(i)} />;
      })}
    </Masonry>
  );
};

const SeriePage = (props: AsyncReturnType<typeof getStaticProps>["props"]) => {
  const { prev, next, route } = props;

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const { serie } = data;

  if (serie && serie.isPublished) {
    const { meta, publishedAt, title, description, summary, cover, masonry } =
      serie;

    const firstTag =
      serie?.meta?.tags[0]?.charAt(0).toUpperCase() +
      serie?.meta?.tags[0]?.slice(1);
    const secondTag =
      serie?.meta?.tags[1]?.charAt(0).toUpperCase() +
      serie?.meta?.tags[1]?.slice(1);
    const thirdTag =
      serie?.meta?.tags[2]?.charAt(0).toUpperCase() +
      serie?.meta?.tags[2]?.slice(1);
    const seoProps: NextSeoProps = {
      title: serie?.seo?.title,
      titleTemplate: `%s | Serie | ${firstTag} ${secondTag} ${thirdTag}`,
      robotsProps: {
        maxImagePreview: "standard",
        notranslate: true,
        maxSnippet: -1,
      },
      description: serie?.seo?.description,
      canonical: `${process.env.NEXT_PUBLIC_WEB_URI}/${route}`,
      mobileAlternate: {
        media: "handheld",
        href: `${process.env.NEXT_PUBLIC_WEB_URI}/${route}`,
      },
      additionalMetaTags: [
        {
          property: "article:published_time",
          content: serie?.publishedAt,
        },
      ],
      openGraph: {
        url: `${process.env.NEXT_PUBLIC_WEB_URI}/${route}`,
        type: "article",
        title: serie?.seo?.title,
        article: {
          authors: ["Aníbal Santos Gómez"],
          publishedTime: serie?.publishedAt,
          tags: serie?.meta?.tags,
          section: "Series",
        },
        description: serie?.seo?.description,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_WEB_URI}/static/series/${serie.sequence}.jpg`,
            width: 400,
            height: 400,
            alt: serie?.seo?.title,
          },
        ],
      },
    };

    return (
      <Layout rawData={data} data={data.global as any} seo={seoProps}>
        <motion.article
          key={route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Section>
            <HeroSerie
              {...{
                type: "serie",
                headline: title,
                tagline: description,
                image: {
                  url: cover,
                  alt: title,
                },
                text: summary,
                meta,
                publishedAt,
              }}
            />
          </Section>
          {masonry && (
            <Lightbox>
              <WrapperMasonry masonry={masonry} />
            </Lightbox>
          )}
          <SocialShare
            title={title}
            url={`https://anibalsantosgomez.com/${route}`}
          />
          {(next || prev) && <Pagination next={next} prev={prev} />}
        </motion.article>
      </Layout>
    );
  }
  return <FourOhFour />;
};

export default SeriePage;

export const getStaticProps = async ({ params }) => {
  const allSeries = await (
    await client.queries.serieConnection()
  ).data.serieConnection.edges
    .map(({ node }) => node)
    .filter((serie) => serie.isPublished);

  const serieIndex = allSeries
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1))
    .findIndex((serie) => serie._sys.filename === params.filename);

  const prevSerie = allSeries[serieIndex - 1] || null;
  const nextSerie = allSeries[serieIndex + 1] || null;

  const prev =
    (prevSerie && { title: prevSerie.title, route: prevSerie._sys.filename }) ||
    null;
  const next =
    (nextSerie && { title: nextSerie.title, route: nextSerie._sys.filename }) ||
    null;

  const tinaProps = await client.queries.serieQuery({
    relativePath: `${params.filename}.mdx`,
  });

  return {
    props: {
      ...tinaProps,
      route: `serie/${params.filename}`,
      prev,
      next,
    },
  };
};

export const getStaticPaths = async () => {
  const postsListData = await client.queries.serieConnection();
  return {
    paths: postsListData.data.serieConnection.edges.map((post) => ({
      params: {
        filename: post.node._sys.filename,
      },
    })),
    fallback: "blocking",
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
