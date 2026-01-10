const QuickActions = () => {
  return (
    <section className="grid md:grid-cols-3 gap-6">
      {[
        { icon: "add_a_photo", title: "Report New Issue" },
        { icon: "history", title: "View My Activity" },
        { icon: "category", title: "Explore Categories" }
      ].map(item => (
        <div
          key={item.title}
          className="bg-white p-6 rounded-xl border hover:shadow cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary text-3xl">
            {item.icon}
          </span>
          <h3 className="font-bold mt-3">{item.title}</h3>
        </div>
      ))}
    </section>
  );
};

export default QuickActions;
