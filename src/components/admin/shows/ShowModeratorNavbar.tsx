import BackArrow from '@/components/shared/BackArrow';
import { ShowWithVenueAndRun } from '@/models/show.model';
import {
  selectOpenSection,
  selectSelectedShow,
  setOpenSection,
  setSelectedShow,
} from '@/store/admin/showModerator.store';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShowEditorSection, formatShowLabel } from './ShowEditor';

const ShowModeratorNavbar: React.FC = () => {
  const router = useRouter();
  const navAdminPage = () => router.push('/admin');
  const dispatch = useDispatch();
  const selectShow = (show: ShowWithVenueAndRun | null) => dispatch(setSelectedShow(show));
  const closeShow = () => selectShow(null);
  const chooseSection = (section: ShowEditorSection | null) => dispatch(setOpenSection(section));
  const closeSection = () => chooseSection(null);
  const selectedShow = useSelector(selectSelectedShow);
  const openSection = useSelector(selectOpenSection);

  const label = selectedShow ? (openSection ? formatShowLabel(selectedShow) : 'All Shows') : 'Admin';
  const onClick = selectedShow ? (openSection ? closeSection : closeShow) : navAdminPage;

  return (
    <BackArrow
      width={16}
      height={16}
      onClick={onClick}
      className="cursor-pointer flex items-center justify-start w-full space-x-2"
      svgClass="fill-black dark:fill-white"
    >
      <p className="">{label}</p>
    </BackArrow>
  );
};

export default ShowModeratorNavbar;
