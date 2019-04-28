import remark from 'remark';
import remarkHtml from 'remark-html';
import visit from 'unist-util-visit';
import isAbsoluteUrl from 'is-absolute-url';

const RE_IMAGE_DIMENSIONS = /^\(\d+,\s?\d+\)$/;

const prepareImage = () => (tree) =>
  visit(tree, 'image', (imageNode, index, parent) => {
    const node = parent.children[index + 1];
    imageNode.url = isAbsoluteUrl(imageNode.url)
      ? imageNode.url
      : `${window.__blog__.paths.static}${imageNode.url}`;

    if (
      node.type !== 'text' ||
      typeof node.value !== 'string' ||
      !Boolean(node.value.trim().match(RE_IMAGE_DIMENSIONS))
    ) {
      return;
    }

    parent.children.splice(index + 1, 1);
  });

export const markdown = (markdownContent) =>
  new Promise((resolve, reject) =>
    remark()
      .use(prepareImage)
      .use(remarkHtml)
      .process(markdownContent, (err, file) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(String(file));
      })
  );
