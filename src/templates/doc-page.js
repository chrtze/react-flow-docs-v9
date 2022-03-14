import React from 'react';
import { graphql } from 'gatsby';
import { Flex, Box } from 'reflexbox';
import styled from '@emotion/styled';

import DocPage from 'components/Page/Doc';
import Mdx from './mdx-renderer/DocMdx';
import { H1 } from 'components/Typo';
import Icon from 'components/Icon';

const docsMenu = [
  { title: 'Introduction' },
  { title: 'Getting Started' },
  { title: 'Theming' },
  {
    group: 'API Reference',
    items: [
      { title: 'Prop Types' },
      { title: 'Helper Functions' },
      {
        group: 'Nodes',
        items: [{ title: 'Node Options' }, { title: 'Node Types & Custom Nodes' }, { title: 'Handle Component' }],
      },
      {
        group: 'Edges',
        items: [{ title: 'Edge Options' }, { title: 'Edge Types & Custom Edges' }, { title: 'Edge Utils' }],
      },
      { title: 'Instance' },
      { title: 'Internal State and Actions' },
      { title: 'Hooks' },
      {
        group: 'Components',
        items: [{ title: 'Background' }, { title: 'Mini Map' }, { title: 'Controls' }, { title: 'Provider' }],
      },
    ],
  },
];

const EditLink = styled.a`
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.6;
  }

  .icon {
    margin-right: 5px;
  }
`;

const EditButton = ({ slug }) => (
  <Flex my={[4, 4, 5]}>
    <EditLink
      href={`https://github.com/wbkd/react-flow-docs-v9/edit/main/src/markdown${slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon width="22px" name="pen" colorizeStroke strokeColor="red" />
      Edit this page
    </EditLink>

    <Box ml="auto" color="#808080">
      current version: {__REACT_FLOW_VERSION__}
    </Box>
  </Flex>
);

function extendMenu(items, menuData) {
  items.forEach((menuItem) => {
    if (menuItem.group) {
      return extendMenu(menuItem.items, menuData);
    }

    menuItem.slug = menuData.find((m) => (m.id || m.title) === menuItem.title)?.slug || '/';
  });
}

const DocPageTemplate = ({ data, pageContext }) => {
  const { content } = data;
  const { title } = content.frontmatter;
  const slug = content.fileAbsolutePath.split('markdown')[1];
  const metaTags = {
    title: `React Flow - ${title} Docs`,
    description: content.excerpt,
    siteUrl: `https://reactflow.dev${content.fields.slug}`,
    robots: 'noindex, nofollow',
  };

  extendMenu(docsMenu, pageContext.menu);

  return (
    <DocPage metaTags={metaTags} menu={docsMenu}>
      <H1>{title}</H1>
      <Mdx content={content.body} />
      <EditButton slug={slug} />
    </DocPage>
  );
};

export default DocPageTemplate;

export const pageQuery = graphql`
  query DocPageBySlug($slug: String!) {
    content: mdx(fields: { slug: { eq: $slug } }) {
      id
      fileAbsolutePath
      excerpt
      body
      fields {
        slug
      }
      frontmatter {
        id
        title
      }
    }
  }
`;
