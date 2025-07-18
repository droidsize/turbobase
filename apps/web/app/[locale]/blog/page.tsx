import { blog, type Post } from '@packages/cms';
import { Image } from '@packages/cms/components/image';
import { cn } from '@packages/base/lib/utils';
import { getDictionary } from '@packages/i18n';
import type { Blog, WithContext } from '@packages/seo/json-ld';
import { JsonLd } from '@packages/seo/json-ld';
import { createMetadata } from '@packages/seo/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

type BlogProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: BlogProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.blog.meta);
};

const BlogIndex = async ({ params }: BlogProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const posts = blog.getPosts();

  const jsonLd: WithContext<Blog> = {
    '@type': 'Blog',
    '@context': 'https://schema.org',
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto flex flex-col gap-14">
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.blog.meta.title}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts && posts.length > 0 ? (
              posts.map((post: Post, index: number) => (
                <Link
                  href={`/blog/${post._slug}`}
                  className={cn(
                    'flex cursor-pointer flex-col gap-4 hover:opacity-75',
                    !index && 'md:col-span-2'
                  )}
                  key={post._slug}
                >
                  <Image
                    src={post.image}
                    alt=""
                    width={600}
                    height={300}
                  />
                  <div className="flex flex-row items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="max-w-3xl text-4xl tracking-tight">
                      {post._title}
                    </h3>
                    <p className="max-w-3xl text-base text-muted-foreground">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground">No blog posts available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogIndex;
