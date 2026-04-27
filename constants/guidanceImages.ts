import { ImageSourcePropType } from "react-native";
import { type ProtocolId } from "./protocols";

export type GuidanceImage = ImageSourcePropType | null;

/**
 * Maps each protocol step to its corresponding illustration.
 * React Native requires static `require()` calls, so paths cannot be dynamic.
 */
export const guidanceStepImages: Record<ProtocolId, GuidanceImage[]> = {
  cardiac_arrest: [
    require("../assets/guidance/cardiac_arrest_step_1.png"),
    require("../assets/guidance/cardiac_arrest_step_2.png"),
    require("../assets/guidance/cardiac_arrest_step_3.png"),
    require("../assets/guidance/cardiac_arrest_step_4.png"),
    require("../assets/guidance/cardiac_arrest_step_5.png"),
  ],
  bleeding: [
    require("../assets/guidance/bleeding_step_1.png"),
    require("../assets/guidance/bleeding_step_2.png"),
    require("../assets/guidance/bleeding_step_3.png"),
    require("../assets/guidance/bleeding_step_4.png"),
    require("../assets/guidance/bleeding_step_5.png"),
  ],
  unconscious: [
    require("../assets/guidance/unconscious_step_1.png"),
    require("../assets/guidance/unconscious_step_2.png"),
    require("../assets/guidance/unconscious_step_3.png"),
    require("../assets/guidance/unconscious_step_4.png"),
    require("../assets/guidance/unconscious_step_5.png"),
  ],
  choking: [
    require("../assets/guidance/choking_step_1.png"),
    require("../assets/guidance/choking_step_2.png"),
    require("../assets/guidance/choking_step_3.png"),
    require("../assets/guidance/choking_step_4.png"),
    require("../assets/guidance/choking_step_5.png"),
  ],
  epilepsy: [
    require("../assets/guidance/epilepsy_step_1.png"),
    require("../assets/guidance/epilepsy_step_2.png"),
    require("../assets/guidance/epilepsy_step_3.png"),
    require("../assets/guidance/epilepsy_step_4.png"),
    require("../assets/guidance/epilepsy_step_5.png"),
  ],
};

export function getGuidanceStepImage(
  protocol: ProtocolId,
  stepIndex: number,
): GuidanceImage {
  const protocolImages = guidanceStepImages[protocol] ?? [];
  return protocolImages[stepIndex] ?? null;
}
