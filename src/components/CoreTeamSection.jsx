import React, { useMemo } from 'react';
import { Camera, UserRound } from 'lucide-react';
import { coreTeamData } from '../data/coreTeamData';
import { TestimonialSlider } from './ui/testimonial-slider-1';

const memberRoleQuotes = {
  "jithin-k-c": "Guiding the student body with vision, mentoring innovation, and empowering future technology leaders.",
  "angisha-b": "Empowering our department through collaborative student initiatives, technical excellence, and community growth.",
  "parvathy-krishna-m": "Fostering teamwork, innovation, and active student participation across all AIDA initiatives.",
  "adhithyan-vv": "Streamlining administrative coordination, technical developments, and departmental operations.",
  "jesna-c-j": "Supporting event operations and organizational execution with dedication and precision.",
  "mohamed-u-v": "Ensuring optimal budget planning, financial transparency, and resource management.",
  "vrindha-manoj-kumar": "Assisting with financial management and event logistics for seamless execution.",
  "dhruva-c": "Connecting students, faculty, and industry partners to amplify AIDA's achievements.",
  "lakshmi-p-r": "Driving outreach and media engagement to showcase department talent and initiatives.",
  "vaishnava-o-j": "Building strong community ties and promoting student participation across events.",
  "vishnu-a-s": "Facilitating communication, announcements, and public relations for department programs.",
  "joel-pauly": "Crafting visual narratives, digital assets, and media content for AIDA events.",
  "shaun-saji-e": "Capturing key moments and designing engaging digital media for department activities.",
  "stanes-wilson": "Directing creative media production, video editing, and visual story-telling.",
  "alan-e-alexander": "Contributing technical support and active execution for department programs.",
  "asna-a": "Coordinating student engagement and managing logistical needs for events.",
  "ayaan-mohammed": "Supporting event setup, technological initiatives, and community outreach.",
  "bilal-v": "Assisting in technical workshops and student leadership activities.",
  "jessia-jojo-kanjirathingal": "Managing administrative tasks and promoting student involvement in AI activities.",
  "maria-francies": "Fostering creative ideas and supporting execution across department events.",
  "rithul-r-nair": "Providing technical assistance and active support for student projects."
};

const memberEmails = {
  "jithin-k-c": "jithinkc@jecc.ac.in",
  "angisha-b": "angisha.b@jecc.ac.in",
  "parvathy-krishna-m": "parvathy.m@jecc.ac.in",
  "adhithyan-vv": "adhithyan.vv@jecc.ac.in",
  "jesna-c-j": "jesna.cj@jecc.ac.in",
  "mohamed-u-v": "mohamed.uv@jecc.ac.in",
  "vrindha-manoj-kumar": "vrindha.m@jecc.ac.in",
  "dhruva-c": "dhruva.c@jecc.ac.in",
  "lakshmi-p-r": "lakshmi.pr@jecc.ac.in",
  "vaishnava-o-j": "vaishnava.oj@jecc.ac.in",
  "vishnu-a-s": "vishnu.as@jecc.ac.in",
  "joel-pauly": "joel.pauly@jecc.ac.in",
  "shaun-saji-e": "shaun.saji@jecc.ac.in",
  "stanes-wilson": "stanes.wilson@jecc.ac.in",
  "alan-e-alexander": "alan.alexander@jecc.ac.in",
  "asna-a": "asna.a@jecc.ac.in",
  "ayaan-mohammed": "ayaan.m@jecc.ac.in",
  "bilal-v": "bilal.v@jecc.ac.in",
  "jessia-jojo-kanjirathingal": "jessia.jojo@jecc.ac.in",
  "maria-francies": "maria.francies@jecc.ac.in",
  "rithul-r-nair": "rithul.nair@jecc.ac.in",
};

const RESERVED_POSITIONS = 8;

export default function CoreTeamSection() {
  const hasMembers = coreTeamData && coreTeamData.length > 0;

  const reviews = useMemo(() => {
    if (!hasMembers) return [];
    return coreTeamData.map((member) => ({
      id: member.id,
      name: member.name,
      affiliation: member.semester
        ? `${member.designation} • ${member.semester}`
        : member.designation,
      quote:
        memberRoleQuotes[member.id] ||
        `Dedicated core team member contributing to AIDA events, leadership, and department growth.`,
      imageSrc: `${member.photo}-800.webp`,
      thumbnailSrc: `${member.photo}-400.webp`,
      email: memberEmails[member.id] || `${member.id}@jecc.ac.in`,
      linkedin: `https://linkedin.com/in/${member.id}`,
    }));
  }, [hasMembers]);

  return (
    <section
      id="core-team"
      aria-labelledby="core-team-heading"
      className="py-8 sm:py-12 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="font-mono text-xs tracking-widest text-red-500 uppercase mb-3 block">
            • AIDA STUDENT LEADERSHIP
          </span>
          <h2 id="core-team-heading" className="font-serif text-3xl sm:text-5xl md:text-6xl text-white">
            Meet the <span className="text-red-600 italic">Core Team</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            The student leadership team coordinating AIDA initiatives, events, and community activities.
          </p>
        </div>

        {hasMembers ? (
          <div className="w-full">
            <TestimonialSlider
              reviews={reviews}
              initialIndex={0}
              className="bg-transparent"
            />
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 ring-1 ring-inset ring-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-7">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-red-600/15 border border-red-900/50 grid place-items-center text-red-500">
                  <UserRound size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-white font-bold">Core-team details are being prepared</h3>
                  <p className="text-neutral-500 text-sm mt-1">Names, designations, and official photographs will be added once supplied.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                Awaiting official details
              </span>
            </div>

            <div aria-hidden="true" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from({ length: RESERVED_POSITIONS }, (_, index) => (
                <div key={index} className="aspect-[4/5] rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/50 grid place-items-center">
                  <Camera size={18} className="text-neutral-700" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
