import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { changeSkills, selectSkills } from "@/app/lib/redux/resumeSlice";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
  selectThemeColor,
} from "@/app/lib/redux/settingsSlice";
import { Form } from "./Form";
import { BulletListTextArea, InputGroupWrapper } from "./Form/InputGroup";
import { BulletListIconButton } from "./Form/IconButton";
import { FeaturedSkillInput } from "./Form/FeaturedSkillInput";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";

  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    dispatch(changeSkills({ field, value }));
  };

  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };

  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextArea
            label="Habilidades"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleSkillsChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[6rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
        </div>
       </div>
    </Form>
  );
};
