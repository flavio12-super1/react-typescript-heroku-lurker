import { Text, Element } from "slate";

export interface CustomText extends Text {
  bold?: true;
}

export type CustomElement = {
  type: string;
  character?: string;
  children: CustomText[];
};

export interface MentionElement extends CustomElement {
  type: "mention";
  character: string;
}

export const isMentionElement = (element: any): element is MentionElement => {
  return element.type === "mention";
};
