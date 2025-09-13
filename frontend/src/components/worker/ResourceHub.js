import React, { useState } from "react";
import { ChevronDown, Shield, AlertTriangle, Wrench, Phone } from "lucide-react";

export function ResourceHub() {
  const [openSections, setOpenSections] = useState(["safety"]);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const safetyInstructions = [
    {
      title: "Personal Protective Equipment",
      items: ["Safety gloves", "High-visibility vest", "Steel-toe boots", "Safety glasses"],
    },
    {
      title: "Hazardous Waste Handling",
      items: ["Use proper containers", "Label all materials", "Avoid direct contact", "Report spills immediately"],
    },
    {
      title: "General Safety",
      items: ["Stay hydrated", "Take regular breaks", "Use proper lifting techniques", "Be aware of traffic"],
    },
  ];

  const checklists = [
    {
      title: "General Waste Collection",
      items: [
        { task: "Inspect area for hazards", completed: false },
        { task: "Wear appropriate PPE", completed: false },
        { task: "Collect and bag waste", completed: false },
        { task: "Clean collection area", completed: false },
        { task: "Take completion photos", completed: false },
      ],
    },
    {
      title: "Hazardous Waste Disposal",
      items: [
        { task: "Verify waste type", completed: false },
        { task: "Use specialized containers", completed: false },
        { task: "Follow disposal protocols", completed: false },
        { task: "Complete documentation", completed: false },
        { task: "Report to supervisor", completed: false },
      ],
    },
  ];

  const equipment = [
    { name: "Collection Bags", description: "Heavy-duty waste bags", status: "available" },
    { name: "Safety Gloves", description: "Cut-resistant work gloves", status: "available" },
    { name: "Hazmat Containers", description: "Specialized disposal containers", status: "limited" },
    { name: "Cleaning Supplies", description: "Disinfectant and cleaning tools", status: "available" },
  ];

  const emergencyContacts = [
    { title: "Emergency Services", number: "911", description: "Fire, Police, Medical" },
    { title: "Supervisor", number: "(555) 123-4567", description: "Direct supervisor" },
    { title: "Hazmat Hotline", number: "(555) 987-6543", description: "Chemical spill response" },
    { title: "Support Center", number: "(555) 456-7890", description: "Technical support" },
  ];

  const SectionHeader = ({ icon: Icon, title, sectionKey }) => (
    <div
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-200 ${
          openSections.includes(sectionKey) ? "rotate-180" : ""
        }`}
      />
    </div>
  );

  return (
    <div className="space-y-4 mt-4">
      {/* Safety Instructions */}
      <div>
        <SectionHeader icon={Shield} title="Safety" sectionKey="safety" />
        {openSections.includes("safety") && (
          <div className="mt-2 space-y-3">
            {safetyInstructions.map((section, idx) => (
              <div key={idx} className="p-3 border rounded bg-white">
                <div className="font-semibold text-xs mb-2">{section.title}</div>
                <ul className="space-y-1">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Checklists */}
      <div>
        <SectionHeader icon={AlertTriangle} title="Checklists" sectionKey="checklists" />
        {openSections.includes("checklists") && (
          <div className="mt-2 space-y-3">
            {checklists.map((checklist, idx) => (
              <div key={idx} className="p-3 border rounded bg-white">
                <div className="font-semibold text-xs mb-2">{checklist.title}</div>
                <div className="space-y-2">
                  {checklist.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="w-3 h-3 rounded border-gray-300" defaultChecked={item.completed} />
                      <span className="text-xs text-gray-500">{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipment */}
      <div>
        <SectionHeader icon={Wrench} title="Equipment" sectionKey="equipment" />
        {openSections.includes("equipment") && (
          <div className="mt-2 space-y-2">
            {equipment.map((item, idx) => (
              <div key={idx} className="p-2 rounded border bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">{item.name}</span>
                  <span
                    className={`text-xs px-1 rounded ${
                      item.status === "available" ? "bg-gray-200 text-gray-700" : "bg-yellow-200 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div>
        <SectionHeader icon={Phone} title="Emergency" sectionKey="contacts" />
        {openSections.includes("contacts") && (
          <div className="mt-2 space-y-2">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-2 rounded border bg-white">
                <div className="font-semibold text-xs">{contact.title}</div>
                <div className="text-xs font-mono text-blue-600">{contact.number}</div>
                <div className="text-xs text-gray-500">{contact.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceHub;
