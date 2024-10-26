import React from "react";
import Title from "../components/Title";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt=8 border-t px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px]" src="" alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
            provident dolores praesentium error facere et vero deserunt odit. Ad
            iste et ipsum facilis id atque temporibus doloribus, sit quasi
            quidem!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsum
            molestias, ratione reiciendis dignissimos alias magni laborum autem
            quam facere aut rem saepe maiores, odio nostrum dicta dolores fugiat
            similique.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
