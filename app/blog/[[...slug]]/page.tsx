import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { source } from '@/lib/source';

// Define the correct type for the dynamic route parameters
type DocsPageParams = {
  // [[...slug]] can be an array of strings or undefined (for the root /docs page)
  slug?: string[]; 
};

/**
 * Main Page Component for the Catch-all Route: /docs/[[...slug]]
 * The props are defined using a simple object type, which is the standard
 * way to handle dynamic parameters in the Next.js App Router.
 */
export default async function Page({ params }: { params: DocsPageParams }) {
  // Destructure params from props directly in the function signature for clarity.
  const { slug } = params;
  
  const page = source.getPage(slug);
  
  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents(
            {
              // Custom 'a' component for relative links within fumadocs
              a: createRelativeLink(source, page),
            },
          )}
        />
      </DocsBody>
    </DocsPage>
  );
}

/**
 * Generates the static paths for all documentation pages at build time.
 */
export async function generateStaticParams() {
  return source.generateParams();
}

/**
 * Generates metadata (title, description) for each page.
 */
export async function generateMetadata({ params }: { params: DocsPageParams }) {
  // Destructure params from props directly in the function signature
  const { slug } = params;
  const page = source.getPage(slug);
  
  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}