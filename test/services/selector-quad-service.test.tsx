import {
    ColorGeneratorServiceInterface,
    SelectorHierarchyService,
    Color,
    ForThoustPanel
} from "../../src/services/selector-hierarchy-service";

describe("selector quad service", () => {
   test("selector triad generator", () => {
       const colorService: ColorGeneratorServiceInterface = new class implements ColorGeneratorServiceInterface{
           getQuad(color: Color, seed?: any): Color[] {
               return [
                   { rbg: ["0", "1", "1", "0.3"], hex: "#eee" },
                   { rbg: ["1", "0", "1", "0.3"], hex: "#1ee" },
                   { rbg: ["1", "1", "0", "0.3"], hex: "#e2e" },
                   { rbg: ["1", "1", "1", "0.3"], hex: "#ee3" }
                ];
           }

           getSplitComponent(color: Color, seed?: any): Color[] {
               return [
                   { rbg: ["0", "1", "1", "0.3"], hex: "#eee" },
                   { rbg: ["1", "1", "1", "0.3"], hex: "#ee3" }
               ];
           }

           getTriad(color: Color, seed?: any): Color[] {
               return [
                   { rbg: ["1", "0", "1", "0.3"], hex: "#1ee" },
                   { rbg: ["1", "1", "0", "0.3"], hex: "#e2e" },
                   { rbg: ["1", "1", "1", "0.3"], hex: "#ee3" }
               ];
           }

       }
       const selectorHierarchyService = new SelectorHierarchyService(colorService)

       expect(ForThoustPanel(
           [
               {
                   elem: [
                       { id: "sweedish fish1" },
                       { id: "sweedish fish2" },
                       { id: "sweedish fish3" }
                   ]
               }
           ], selectorHierarchyService).htmlSelectors.keys()[0]).toBe("sweedish fish1") // critic acid yum

       expect uhhh the colors duke, the colors
   })
});