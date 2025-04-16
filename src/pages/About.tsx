
import { User } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto glass p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-center mb-8">
            About <span className="text-gradient">Pocket Radio</span>
          </h1>
          
          <div className="space-y-6">
            <p className="text-lg text-gray-300">
              Pocket Radio is an innovative IoT notification system that brings your connected devices to life through intelligent audio cues. Our platform transforms the way you interact with your smart devices by providing context-aware notifications that are both intuitive and elegant.
            </p>
            
            <p className="text-lg text-gray-300">
              Using advanced sound design and smart device integration, Pocket Radio creates a seamless experience that keeps you informed without being intrusive. Whether it's your smart home devices, security systems, or IoT sensors, our platform ensures you stay connected in style.
            </p>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-center">Our Creators</h2>
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                {[
                  {
                    name: "Asmita Bag",
                    role: "Co-Creator",
                  },
                  {
                    name: "Naman Sharma",
                    role: "Co-Creator",
                  },
                ].map((creator) => (
                  <div key={creator.name} className="text-center glass p-6 rounded-xl w-full md:w-64">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-baby-blue/20 flex items-center justify-center">
                      <User className="w-8 h-8 text-baby-blue" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{creator.name}</h3>
                    <p className="text-gray-300">{creator.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
