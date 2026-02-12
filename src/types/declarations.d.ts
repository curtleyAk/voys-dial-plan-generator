declare module "react-mermaid2" {
  import { Component } from "react";

  export interface MermaidProps {
    chart: string;
    config?: any;
    onError?: (error: any) => void;
  }

  export default class Mermaid extends Component<MermaidProps> {}
}
