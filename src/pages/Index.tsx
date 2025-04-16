
import { ArrowRight, BellRing, Radio, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1 mb-6 rounded-full glass animate-fade-in">
            Discover the Future of IoT Notifications
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Your World,{" "}
            <span className="text-gradient">Connected Through Sound</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in">
            Experience a new way of staying connected with context-aware audio
            notifications that bring your IoT devices to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link 
              to="/demo" 
              className="px-8 py-3 rounded-full bg-baby-blue hover:bg-accent transition-all duration-300 hover-scale flex items-center justify-center gap-2"
            >
              Try Demo <ArrowRight size={20} />
            </Link>
            <Link 
              to="/about"
              className="px-8 py-3 rounded-full glass hover:bg-white/20 transition-all duration-300 hover-scale"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It <span className="text-gradient">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Radio className="w-8 h-8 text-baby-blue" />,
                title: "Connect Devices",
                description:
                  "Link your IoT devices seamlessly to the Pocket Radio network",
              },
              {
                icon: <BellRing className="w-8 h-8 text-baby-blue" />,
                title: "Customize Alerts",
                description:
                  "Set up personalized audio notifications for different events",
              },
              {
                icon: <Zap className="w-8 h-8 text-baby-blue" />,
                title: "Stay Informed",
                description:
                  "Receive context-aware notifications through elegant audio cues",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-xl hover-scale animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
