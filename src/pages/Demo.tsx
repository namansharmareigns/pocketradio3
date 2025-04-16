
import NotificationDemo from "@/components/features/notifications/NotificationDemo";
import MessageDemo from "@/components/features/messages/MessageDemo";

const Demo = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Notification Demo Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Try Our <span className="text-gradient">Smart Notifications</span>
          </h2>
          <div className="glass p-8 rounded-xl">
            <NotificationDemo />
          </div>
        </div>
      </section>

      {/* Message Demo Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Try Our <span className="text-gradient">Messaging System</span>
          </h2>
          <div className="max-w-md mx-auto">
            <div className="glass p-8 rounded-xl">
              <MessageDemo />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
