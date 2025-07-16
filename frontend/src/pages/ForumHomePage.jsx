import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import { useParams } from 'react-router-dom';
import forumData from '../utils/fetchForumsData';
import ForumContext from '../context/ForumContext';
import { useContext, useEffect, useState } from 'react';

function ForumHomePage() {
  const { forumTitle } = useParams();
  const decodedTitle = decodeURIComponent(forumTitle || '');

  const forum = forumData.find(item => item.title == decodedTitle);

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="flex w-screen flex-1">
        <LeftAsideBar />
        <section className="bg-main-elements flex-1 p-6">
          <ForumContext.Provider value={forum}>
            <ForumHeader />
            <ForumPosts />
            <ForumLeftBar />
          </ForumContext.Provider>
        </section>
      </main>
    </div>
  );
}

function ForumHeader() {
  const forum = useContext(ForumContext);
  console.log(forum);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-font text-hero my-2 font-semibold">{forum.title}</p>
        <p className="text-font text-body">{forum.description}</p>
      </div>
      <div className="flex gap-2">
        <button className="text-font rounded-button-round text-body cursor-pointer bg-[#4169E1] px-3 py-2 text-2xl font-semibold hover:bg-[#255FCC]">
          Create Thread
        </button>
        <button className="rounded-button-round hover:text-font text-body cursor-pointer border border-[#255FCC] px-3 py-2 text-2xl font-semibold text-[#255FCC] transition-all duration-300 ease-in-out hover:bg-[#255FCC] hover:bg-[#4169E1]">
          Join Forum
        </button>
      </div>
    </div>
  );
}

function ForumPosts() {
  return (
    <div>
      <p></p>
    </div>
  );
}

function ForumLeftBar() {}

export default ForumHomePage;
