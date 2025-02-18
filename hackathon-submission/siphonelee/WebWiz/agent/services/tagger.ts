import { Page } from "puppeteer";

const INTERACTIVE_ELEMENTS = [
  "a",
  "button",
  "input",
  "textarea",
  "option",
  "label",
  "audio",
  "video",
  "[role=button]",
  "[role=treeitem]",
  '[onclick]:not([onclick=""])',
];    

const resetIdentifierAttribute = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[WebWiz-tag-attr]');
    for (const element of elements) {
      element.removeAttribute('WebWiz-tag-attr');
    }
  });
};

const tagInteractiveElements = async (page: Page) => {
  await page.$$eval(
    INTERACTIVE_ELEMENTS.join(", "),

    function (elements) {
      if (elements.length === 0) {
        throw new Error("No elements found");
      }

      const isHTMLElement = (element: Element): element is HTMLElement => {
        return element instanceof HTMLElement;
      };

      const isElementStyleVisible = (element: Element) => {
        const style = window.getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          style.width !== "0px" &&
          style.height !== "0px"
        );
      };

      const isElementVisible = (element: Element | undefined | null) => {
        if (element === null || element === undefined) {
          throw new Error("isElementVisible: Element is null or undefined");
        }

        let currentElement: Element | null = element;
        while (currentElement) {
          if (!isElementStyleVisible(currentElement)) {
            return false;
          }

          currentElement = currentElement.parentElement;
        }
        return true;
      };

      const setUniqueIdentifierBasedOnTextContent = (element: Element) => {
        const { textContent, tagName } = element;
        if (textContent === null) {
          return;
        }

        element.setAttribute('WebWiz-tag-attr', textContent.trim().toLowerCase());
      };

      const setUniqueIdentifierBasedOnIndex = (element: Element, index: number) => {
        element.setAttribute('WebWiz-tag-attr', '' + index);
      };

      let index: number = 1;
      for (const element of elements) {
        if (isHTMLElement(element)) {
          element.style.outline = "2px solid red";
        }

        if (isElementVisible(element)) {
          setUniqueIdentifierBasedOnIndex(element, index);
          index = index + 1;
        }
      }
    }
  );
};

export const highlightInteractiveElements = async (page: Page) => {
  await resetIdentifierAttribute(page);
  await tagInteractiveElements(page);
};
