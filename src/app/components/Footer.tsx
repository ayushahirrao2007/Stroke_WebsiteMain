import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

export function Footer() {
  const { userRole } = useContext(AuthContext);
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  const academicReferences = [
    {
      category: 'International Clinical Guidelines',
      items: [
        {
          title: 'AHA/ASA Acute Ischemic Stroke Guidelines',
          citation: 'Powers WJ, Rabinstein AA, Ackerson T, et al. Guidelines for the Early Management of Patients With Acute Ischemic Stroke: 2019 Update. Stroke. 2019;50(12):e344-e418.',
          link: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000211'
        },
        {
          title: 'European Stroke Organisation (ESO) Guidelines',
          citation: 'Berge E, Whiteley W, Akinsptan H, et al. European Stroke Organisation (ESO) guidelines on intravenous thrombolysis for acute ischaemic stroke. Eur Stroke J. 2021;6(1):I-LXII.',
          link: 'https://eso-stroke.org/guidelines/'
        },
        {
          title: 'AHA/ASA Spontaneous Intracerebral Hemorrhage Guidelines',
          citation: 'Greenberg SM, Ziai WC, Cordonnier C, et al. 2022 Guideline for the Management of Patients With Spontaneous Intracerebral Hemorrhage. Stroke. 2022;53(7):e282-e361.',
          link: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000407'
        }
      ]
    },
    {
      category: 'Diagnostic Criteria & Neurological Scoring',
      items: [
        {
          title: 'National Institutes of Health Stroke Scale (NIHSS)',
          citation: 'Brott T, Adams HP Jr, Olinger CP, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-870.',
          link: 'https://www.ninds.nih.gov/health-information/public-education/stroke'
        },
        {
          title: 'TOAST Classification of Acute Ischemic Stroke',
          citation: 'Adams HP Jr, Bendixen BH, Kappelle LJ, et al. Classification of subtype of acute ischemic stroke. Definitions for use in a multicenter clinical trial. TOAST. Stroke. 1993;24(1):35-41.',
          link: 'https://pubmed.ncbi.nlm.nih.gov/7678184/'
        },
        {
          title: 'ABCD2 Clinical Risk Score for TIA',
          citation: 'Johnston SC, Rothwell PM, Nguyen-Huynh MN, et al. Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack. Lancet. 2007;369(9558):283-292.',
          link: 'https://pubmed.ncbi.nlm.nih.gov/17258668/'
        }
      ]
    },
    {
      category: 'Authoritative Textbooks & Neuroimaging',
      items: [
        {
          title: 'Adams and Victor’s Principles of Neurology (12th Edition)',
          citation: 'Ropper AH, Samuels MA, Klein JP, Prasad S. Cerebrovascular Diseases. McGraw-Hill Education, 2023.',
          link: '#'
        },
        {
          title: 'Harrison’s Principles of Internal Medicine (21st Edition)',
          citation: 'Loscalzo J, Fauci A, Kasper D, Hauser S, Longo D, Jameson JL. Ischemic Cerebrovascular Disease & Intracranial Hemorrhage. McGraw-Hill, 2022.',
          link: '#'
        },
        {
          title: 'World Stroke Organization (WSO) Global Fact Sheet',
          citation: 'Feigin VL, Brainin M, Norrving B, et al. World Stroke Organization (WSO): Global Stroke Fact Sheet 2022. Int J Stroke. 2022;17(1):18-29.',
          link: 'https://www.world-stroke.org/'
        }
      ]
    }
  ];

  return (
    <>
      <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-blue-950 text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Column 1: Brand & Overview */}
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-purple-100 to-blue-300 bg-clip-text text-transparent mb-3">
                NeuroNexus
              </h3>
              <p className="text-purple-200/90 text-sm leading-relaxed mb-4">
                An evidence-based stroke education platform for medical students, healthcare practitioners, and residents.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-300 bg-white/5 border border-white/10 rounded-lg p-2.5">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>Curated according to AHA/ASA & ESO Clinical Guidelines</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={16} className="text-purple-400" />
                Core Curriculum
              </h4>
              <ul className="space-y-2.5 text-sm text-purple-200/90">
                <li><Link to="/#types-of-strokes" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Types of Strokes (12 Modules)</Link></li>
                <li><Link to="/anatomy" className="hover:text-white transition-colors hover:translate-x-1 inline-block">NeuroAnatomy & Circle of Willis</Link></li>
                <li><Link to="/cvs" className="hover:text-white transition-colors hover:translate-x-1 inline-block">CVS & Hypertension</Link></li>
                <li><Link to="/therapeutics" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Homeopathic Therapeutics</Link></li>
                <li><Link to="/modern-medicines" className="hover:text-white transition-colors hover:translate-x-1 inline-block text-purple-300 font-medium">Modern Medicines & Thrombolysis</Link></li>
                {userRole === 'admin' && (
                  <li><Link to="/admin" className="hover:text-white transition-colors hover:translate-x-1 inline-block text-purple-300 font-bold">Admin Panel</Link></li>
                )}
              </ul>
            </div>

            {/* Column 3: Clinical Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-purple-400" />
                Clinical Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-purple-200/90">
                <li><Link to="/case-studies" className="hover:text-white transition-colors hover:translate-x-1 inline-block">20 Virtual Clinical Encounters</Link></li>
                <li><Link to="/course/11" className="hover:text-white transition-colors hover:translate-x-1 inline-block">CT & MRI Interpretation Guide</Link></li>
                <li><Link to="/course/12" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Stroke Pearls & Clinical Pitfalls</Link></li>
              </ul>
            </div>

            {/* Column 4: References & Citations */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-purple-400" />
                Clinical References
              </h4>
              <ul className="space-y-2 text-xs text-purple-200/80">
                <li className="border-b border-white/5 pb-1.5">
                  <span className="font-medium text-white block">AHA/ASA AIS Guidelines</span>
                  <span>Stroke. 2019;50(12):e344-e418</span>
                </li>
                <li className="border-b border-white/5 pb-1.5">
                  <span className="font-medium text-white block">ESO Thrombolysis Guidelines</span>
                  <span>Eur Stroke J. 2021;6(1):I-LXII</span>
                </li>
                <li className="border-b border-white/5 pb-1.5">
                  <span className="font-medium text-white block">NIHSS Scoring Protocol</span>
                  <span>NINDS / Stroke. 1989;20:864-870</span>
                </li>
                <li className="pt-1">
                  <button
                    onClick={() => setIsReferencesOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/80 border border-purple-400/30 px-3 py-1.5 rounded-md transition-all shadow-sm group"
                  >
                    <span>View All References & Citations</span>
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-purple-800/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-purple-300/80">
            <p>&copy; 2026 NeuroNexus. All rights reserved. For medical education purposes only.</p>
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
              <button
                onClick={() => setIsReferencesOpen(true)}
                className="hover:text-white transition-colors underline underline-offset-4 decoration-purple-400/50"
              >
                References & Attribution
              </button>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Clinical Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Academic References Modal */}
      <Dialog open={isReferencesOpen} onOpenChange={setIsReferencesOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-500/30 shadow-2xl p-6 rounded-2xl">
          <DialogHeader className="border-b border-white/10 pb-4 mb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
              <BookOpen className="text-purple-400" size={24} />
              Medical References, Guidelines & Attributions
            </DialogTitle>
            <DialogDescription className="text-purple-200 text-sm">
              The educational modules, diagnostic algorithms, and clinical case scenarios on NeuroNexus are synthesized from the following peer-reviewed literature and international guidelines.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            {academicReferences.map((section, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="font-semibold text-purple-300 text-base mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  {section.category}
                </h5>
                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-white text-sm">{item.title}</span>
                        {item.link !== '#' && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-200 transition-colors p-1"
                            title="Open external reference"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-purple-200/80 font-mono mt-1 leading-relaxed">
                        {item.citation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Academic & Clinical Disclaimer */}
            <div className="bg-purple-950/80 border border-purple-500/30 rounded-xl p-4 text-xs text-purple-200 leading-relaxed">
              <span className="font-bold text-white block mb-1">Educational Disclaimer:</span>
              NeuroNexus is designed strictly for educational and training purposes for healthcare professionals and medical students. It does not replace individualized clinical judgment, local hospital protocols, or direct emergency consultation.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

