import { notFound } from 'next/navigation';
// Note: next/navigation only allows notFound to be called in a Server Component
// or a Client Component marked with "use client" in the tree above.

import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { source } from '@/lib/source';

// Define the type for the dynamic route parameters
type DocsPageParams = {
  slug?: string[]; // The 'slug' can be an array of strings or undefined (for the root /docs page)
};

/**
 * Main Page Component for the Catch-all Route: /docs/[[...slug]]
 */
export default async function Page(props: { params: DocsPageParams }) {
  // Use a destructuring assignment for clarity
  const { slug } = props.params;
  
  // getPage handles the undefined slug for the root index
  const page = source.getPage(slug);
  
  // If no page is found, trigger the Next.js notFound() function
  if (!page) {
    notFound();
  }

  // MDXContent is a React Component
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
export async function generateMetadata(props: { params: DocsPageParams }) {
  const { slug } = props.params;
  const page = source.getPage(slug);
  
  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}