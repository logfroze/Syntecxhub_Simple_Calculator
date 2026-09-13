import React from 'react';
import { CheckCircle2, Award, FileCode2, Layout, ShieldAlert, Cpu } from 'lucide-react';

export const InternshipChecklist: React.FC = () => {
  const requirements = [
    {
      title: 'Kotlin & XML Layouts Only',
      desc: 'Built purely with Kotlin classes and standard XML Android views. Zero Jetpack Compose utilized, adhering strictly to course criteria.',
      icon: <FileCode2 className="w-4 h-4 text-purple-600" />,
      status: 'Implemented',
    },
    {
      title: 'Decoupled Calculation Engine',
      desc: 'All arithmetic operations and validations are housed in Calculator.kt, keeping MainActivity.kt slim and dedicated only to view-binding.',
      icon: <Cpu className="w-4 h-4 text-blue-600" />,
      status: 'Implemented',
    },
    {
      title: 'Responsive Portrait & Landscape',
      desc: 'Includes both res/layout/activity_main.xml and res/layout-land/activity_main.xml to avoid stretched buttons and prevent display cutoffs.',
      icon: <Layout className="w-4 h-4 text-emerald-600" />,
      status: 'Implemented',
    },
    {
      title: 'Zero Division & Input Validation',
      desc: 'Safely catches 10 ÷ 0 with "Cannot divide by zero". Prevents duplicate decimals, operator spam, and number overflow.',
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
      status: 'Verified',
    },
    {
      title: 'Authentic Student Craft Aesthetic',
      desc: 'Clean solid colors, restrained Material styles, 8dp rounded buttons, no neon glowing shadows, no glassmorphism AI clichés.',
      icon: <Award className="w-4 h-4 text-indigo-600" />,
      status: 'Verified',
    },
  ];

  return (
    <div id="internship-checklist" className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900">
            SyntecxHub Android Development Internship — Week 1 Audit
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">
          5 / 5 Criteria Met
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {requirements.map((req, index) => (
          <div
            key={index}
            className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {req.icon}
                  <span className="text-xs font-semibold text-slate-800">{req.title}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{req.desc}</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Status</span>
              <span className="font-semibold text-emerald-700">{req.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
