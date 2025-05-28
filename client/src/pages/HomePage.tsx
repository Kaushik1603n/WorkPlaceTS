// import { useState } from 'react';
// import { Users, Monitor, Code, FileText } from "lucide-react";
import bg1 from "../assets/bg1.svg";
import pp1 from "../assets/pp1.svg";
import avt from "../assets/avt.jpg";
import NavigationBar from "../components/navigationBar/NavigationBar";


export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <section className="bg-green-50 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Ultimate Destination for{" "}
              <span className="text-green-500">Freelance Talent</span> and{" "}
              <span className="text-green-500">Quality Services!</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Whether you're a business owner or a freelancer, WorkPlace is your
              one-stop-shop for finding or offering freelance services. Join our
              community today and start getting things done!
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition">
                Hire a freelancer
              </button>
              <button className="border border-green-500 text-green-500 px-6 py-3 rounded-md hover:bg-green-50 transition">
                Find Work
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={bg1}
              alt="People working together illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard
              icon={<Monitor size={32} className="mx-auto text-gray-700" />}
              title="Web Design"
            />
            <CategoryCard
              icon={<Code size={32} className="mx-auto text-white" />}
              title="Web Development"
              highlighted={true}
            />
            <CategoryCard
              icon={<Users size={32} className="mx-auto text-gray-700" />}
              title="Software Engineer"
            />
            <CategoryCard
              icon={<FileText size={32} className="mx-auto text-gray-700" />}
              title="Graphic Designer"
            />
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="bg-green-50 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img
              src={pp1}
              alt="Freelancer working illustration"
              className="max-w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h3 className="text-2xl font-bold mb-8">
              A whole world of freelancers talent at your fingertips.
            </h3>

            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">
                The best for every budget
              </h4>
              <p className="text-gray-600">
                Lectus tempus massa faucibus velit tincidunt cras vulputate
                commodo mattis amet tempor arcu.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">
                Quality work done quickly
              </h4>
              <p className="text-gray-600">
                Bibendum odio habitasse quis a nulla est eu sed dictum in id
                facilisi urna maecenas semper non.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Freelancers Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Freelancer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <FreelancerCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <button className="bg-white text-gray-900 px-6 py-2 rounded-md font-medium mb-4 md:mb-0">
              FIND JOBS
            </button>
            <p className="text-gray-400 text-sm">
              © Copyright 2024. All Rights Reserved by Findjobs
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Pinterest</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// function CategoryCard({ icon, title, highlighted = false }) {
//   return (
//     <div
//       className={`border rounded-lg p-8 flex flex-col items-center ${
//         highlighted
//           ? "bg-green-400 text-white"
//           : "bg-white hover:border-green-300"
//       }`}
//     >
//       <div
//         className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
//           highlighted ? "bg-green-500" : "bg-gray-100"
//         }`}
//       >
//         {icon}
//       </div>
//       <h3 className="text-lg font-medium text-center">{title}</h3>
//     </div>
//   );
// }

function FreelancerCard() {
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex flex-col items-center">
      <div className="w-16 h-16 bg-green-200 rounded-full mb-4 overflow-hidden">
        <img
          src={avt}
          alt="Freelancer profile"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-medium mb-1">John</h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        Lorem ipsum is simply dummy text of the printing.
      </p>
      <div className="flex w-full justify-between mt-auto">
        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
          Message
        </button>
        <div className="text-green-500 text-sm font-medium">$30/hr</div>
      </div>
    </div>
  );
}
