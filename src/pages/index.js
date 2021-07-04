import React from 'react';
import controllers from '../api/controller';
import { errorWrapper } from '../utils/errorUtils';
import MainPanel from '../components/MainPanel';

export default function Home({ appUser, postsData }) {
  return (
    <MainPanel appUser={appUser} postsData={postsData} />
  );
}

export async function getServerSideProps({ params, req }) {
  let postsData = {};
  const allBlogsPromise = await controllers.getAllBlogs();
  if (allBlogsPromise.status !== 200) { // TODO extract that and add info level for 200 or 300 codes
    postsData.errors = allBlogsPromise.statusText;
  } else {
    postsData = await allBlogsPromise.json();
    console.log(postsData);
  }
  const appUser = errorWrapper(await controllers.getUser());
  console.log(`appUser : ${appUser.errors}`);
  return {
    props: {
      appUser,
      postsData,
    },
  };
}
