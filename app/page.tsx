import { BirthdayExperience } from "./BirthdayExperience";
import { giftContent } from "../content/giftContent";

export default function Home() {
  return <BirthdayExperience content={giftContent} />;
}
