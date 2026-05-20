import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Brain,
  ChevronRight,
} from 'lucide-react';

export interface AnatomyTopic {
  id: number;
  title: string;
  content: string;
}

const topics: AnatomyTopic[] = [
  {
    id: 1,
    title: 'Brain: Overview',
    content: `
### 1. What is the Brain?

The brain is the most complex organ in the human body. It serves as the center of the nervous system and the command center for the entire body. Protected by the skull, this intricate mass of tissue weighs approximately 1.4 kilograms and contains nearly 100 billion neurons. These neurons form an immensely complex network of connections that produce our every thought, action, memory, and feeling.

### 2. Functions of the Brain

The brain’s operations are vast and vital to human survival and daily functioning. It coordinates both involuntary and voluntary actions across our entire physiological system.

- **Key Functions**
  - Controls autonomic operations like breathing, heart rate, and temperature.
  - Processes sensory information from the body and external environment.
  - Regulates motor output and coordinates voluntary physical movement.
  - Mediates cognitive functions such as memory, attention, problem-solving, and language.
  - Manages emotional responses, behavioral regulation, and hormonal balance.

### 3. How the Brain Works?

The brain works through a vast, highly coordinated network of neurons communicating via electrical and chemical signals. When a signal (action potential) travels down a neuron’s axon, it triggers the release of chemical messengers known as neurotransmitters. These chemicals cross the synaptic gap and bind to receptors on a neighboring cell. This continuous, lightning-fast electrochemical signaling forms the basis of all brain activity and seamless bodily coordination.

### 4. Brain Development

Brain development is a continuous process that begins shortly after conception and extends well into early adulthood. While the foundational structures are largely formed during fetal development, the complex neural circuitry is profoundly shaped by experiences, learning, and environmental interaction throughout childhood and adolescence. A process known as synaptic pruning eventually eliminates weaker connections, allowing the brain's most essential pathways to become more robust and efficient.
`
  },
  {
    id: 2,
    title: 'Anatomy of the Brain',
    content: `
The brain is a highly organized organ made up of multiple structures, each performing specific functions. These parts work together to control the body and maintain normal functioning.

### Main Parts of the Brain

#### 1. Cerebrum
The cerebrum is the largest part of the brain and is responsible for higher mental functions.
- Interprets sensory information (sight, sound, touch, taste, smell)
- Controls voluntary actions such as movement and speech
- Involved in memory, intelligence, reasoning, judgment, and personality
- Divided into left and right hemispheres
- he hemispheres are connected by a thick band of nerve fibers called the corpus callosum

![Cerebrum diagram](/images/anatomy/anatomy1.webp)
![Cerebrum diagram](/images/anatomy/anatomy2.webp)
![Cerebrum diagram](/images/anatomy/anatomy3.webp)

#### 2. Cerebellum
The cerebellum is located at the back of the brain, beneath the cerebrum.
- Maintains balance and posture
- Coordinates voluntary movements
- Controls fine motor skills and precision

![Cerebellum diagram](/images/anatomy/anatomy4.webp)
![Cerebellum diagram](/images/anatomy/anatomy5.webp)

#### 3. Brainstem
The brainstem connects the brain to the spinal cord and controls essential life functions.
- Regulates breathing, heart rate, and blood pressure
- Controls sleep and wake cycles
- Involved in reflexes such as swallowing

![Brainstem diagram](/images/anatomy/anatomy6.webp)
![Brainstem diagram](/images/anatomy/anatomy7.webp)
![Brainstem diagram](/images/anatomy/anatomy8.webp)
![Brainstem diagram](/images/anatomy/anatomy9.webp)
`
  },
  {
    id: 3,
    title: 'Key Brain Structures and Their Functions',
    content: `
### Brain Protection and Coverings
The brain is enclosed within a strong bony structure known as the cranium, which forms part of the skull. This rigid casing helps shield the brain from external injury. Inside the skull, the brain is suspended in a clear fluid called cerebrospinal fluid (CSF). This fluid acts as a cushion, absorbing shocks and reducing the impact of sudden movements.

Between the brain and the inner surface of the skull are three protective layers called the meninges:
- Dura mater – The tough, outermost layer that lines the inner surface of the skull and provides strong protection.
- Arachnoid mater – The delicate middle layer that loosely covers the brain.
- Pia mater – The thin, innermost layer that closely adheres to the brain surface and contains blood vessels supplying it.

### Cranial Nerves
The brain connects to the rest of the body through 12 pairs of cranial nerves. These nerves transmit signals in the form of electrical impulses between the brain and different parts of the body, including muscles and organs. They carry sensory information to the brain and send commands from the brain to control various functions.

### Key Brain Structures and Their Functions

#### 1. Amygdala: 
The amygdala is part of the limbic system and is located in the temporal lobe. It plays an important role in processing emotions, especially fear and emotional responses.

![Amygdala diagram](/images/anatomy/anatomy10.webp)
![Amygdala diagram](/images/anatomy/anatomy11.webp)
![Amygdala diagram](/images/anatomy/anatomy12.webp)
![Amygdala diagram](/images/anatomy/anatomy13.webp)

#### 2. Basal Ganglia: 
These structures are found deep within the cerebrum and are mainly involved in controlling and coordinating voluntary movements.

![Basal Ganglia diagram](/images/anatomy/anatomy14.webp)
![Basal Ganglia diagram](/images/anatomy/anatomy15.webp)
![Basal Ganglia diagram](/images/anatomy/anatomy16.webp)
![Basal Ganglia diagram](/images/anatomy/anatomy17.webp)

#### 3. Thalamus: 
Located above the brainstem, the thalamus acts as a relay station, directing sensory information from the body to the appropriate areas of the cerebral cortex.

![Thalamus diagram](/images/anatomy/anatomy18.webp)
![Thalamus diagram](/images/anatomy/anatomy19.webp)
![Thalamus diagram](/images/anatomy/anatomy20.webp)

#### 4. Hippocampus: 
The hippocampus is a curved, seahorse-shaped structure located deep in the temporal lobe of the brain. It is a key part of the limbic system, mainly responsible for memory and learning.
- You have two hippocampi (one in each hemisphere) 
- Closely connected to the amygdala (emotion) and other brain regions 
- Name comes from Greek: “hippos” (horse) + “kampos” (sea monster)

The hippocampus is part of the hippocampal formation, which includes:
- Dentate gyrus → helps form new memories 
- CA regions (CA1, CA2, CA3) → process and relay information 
- Subiculum → main output region

![Hippocampus diagram](/images/anatomy/anatomy21.webp)
![Hippocampus diagram](/images/anatomy/anatomy22.webp)

#### 5. Hypothalamus: 
The hypothalamus is a small but extremely important region located below the thalamus and just above the pituitary gland in the brain. It acts as a link between the nervous system and the endocrine system.
- Part of the limbic system 
- Maintains the body’s internal balance (homeostasis) 
- Controls hormone release through the pituitary gland 

The hypothalamus is made up of several nuclei (groups of neurons):
- Anterior region → controls body cooling, parasympathetic activity 
- Posterior region → controls body heating, sympathetic activity 
- Lateral hypothalamus → hunger center 
- Ventromedial nucleus → satiety (fullness) center 
- Supraoptic & paraventricular nuclei → produce hormones like ADH & oxytocin

**Clinical Importance**
Problems in the hypothalamus can cause:
- Hormonal imbalances 
- Obesity or loss of appetite 
- Sleep disorders 
- Temperature regulation issues 

Associated conditions include:
- Diabetes insipidus → due to ADH deficiency 
- Hypothalamic tumors 
- Stress-related disorders

#### 6. Pituitary Gland: 
The pituitary gland is a small, pea-sized endocrine gland located at the base of the brain, inside a bony cavity called the sella turcica. It is directly connected to the hypothalamus via a stalk called the infundibulum.
Often called the “master gland” because it controls many other endocrine glands in the body.

The pituitary gland has two main parts:

**1. Anterior Pituitary (Adenohypophysis)**
Produces hormones:
- Growth Hormone (GH) 
- Thyroid-Stimulating Hormone (TSH) 
- Adrenocorticotropic Hormone (ACTH) 
- Follicle-Stimulating Hormone (FSH) 
- Luteinizing Hormone (LH) 
- Prolactin

**2. Posterior Pituitary (Neurohypophysis)**
Does not produce hormones but stores and releases:
- Antidiuretic Hormone (ADH) 
- Oxytocin 
*(These are made in the hypothalamus)*

**Hypothalamus–Pituitary Axis**
- The hypothalamus sends signals to control pituitary hormone release 
- This system is called the hypothalamic–pituitary axis (HPA axis) 
- It keeps the endocrine system balance

**Clinical Importance**
Disorders related to the pituitary gland include:
- Acromegaly → excess GH in adults 
- Gigantism → excess GH in children 
- Diabetes insipidus → lack of ADH 
- Pituitary tumours (adenomas) 

![Pituitary Gland diagram](/images/anatomy/anatomy23.webp)
![Pituitary Gland diagram](/images/anatomy/anatomy24.webp)
![Pituitary Gland diagram](/images/anatomy/anatomy25.webp)
![Pituitary Gland diagram](/images/anatomy/anatomy26.webp)

#### 7. Pineal Gland: 
The pineal gland is a tiny, pinecone-shaped endocrine gland located near the center of the brain, between the two hemispheres, in a groove where the two halves of the thalamus join.
- Part of the epithalamus 
- Plays a key role in regulating the body’s biological clock 
- Secretes the hormone melatonin
- Composed mainly of pinealocytes (melatonin-secreting cells) 
- Contains calcium deposits called “brain sand” (pineal calcification) 
- Highly vascular (rich blood supply)

**Connections**
The pineal gland works closely with:
- Hypothalamus → receives signals about light/dark cycles 
- Eyes (retina) → light information is sent to regulate melatonin 
- Nervous and endocrine systems

**Clinical Importance**
Disorders or issues related to the pineal gland:
- Sleep disorders (insomnia, irregular sleep cycles) 
- Jet lag 
- Seasonal Affective Disorder (SAD) 

Related conditions:
- Insomnia 
- Pineal gland tumors (rare) 
- Excess calcification affecting function

![Pineal Gland diagram](/images/anatomy/anatomy27.webp)
![Pineal Gland diagram](/images/anatomy/anatomy28.webp)
![Pineal Gland diagram](/images/anatomy/anatomy29.webp)
`
  },
  {
    id: 4,
    title: 'Lobes of the Brain',
    content: `
### Lobes of the Brain: 
The cerebrum is divided into two halves called hemispheres—left and right. Each hemisphere contains four main lobes, and each lobe is responsible for specific functions.

![Lobes of the Brain diagram](/images/anatomy/anatomy30.webp)
![Lobes of the Brain diagram](/images/anatomy/anatomy31.webp)

#### 🧠 Frontal Lobe: 
The frontal lobe is the largest lobe of the brain, located at the front (behind the forehead). It plays a critical role in higher mental functions and control of voluntary movement.

**🔑 Key Functions:**
- 🧠 Thinking & Decision-Making – planning, reasoning, judgment 
- 🎭 Personality & Behavior – emotional control, social behavior 
- 🗣️ Speech Production – via Broca’s area 
- 💪 Voluntary Movement – controlled by the motor cortex 
- 📊 Executive Functions – problem-solving, attention, impulse control

![Frontal Lobe diagram](/images/anatomy/anatomy32.webp)
![Frontal Lobe diagram](/images/anatomy/anatomy33.webp)

#### 🧠 Occipital Lobe: 
The occipital lobe is located at the back (posterior part) of the brain and is primarily responsible for vision.

**👁️ Key Functions:**
- Visual Processing – interprets information from the eyes 
- Color Recognition 
- Motion Detection 
- Object & Shape Recognition 

**🧠 Important Area:**
- Primary Visual Cortex (V1) – first region to receive visual signals from the eyes

![Occipital Lobe diagram](/images/anatomy/anatomy34.webp)
![Occipital Lobe diagram](/images/anatomy/anatomy35.webp)

#### 🧠 Parietal Lobe: 
The parietal lobe is located in the upper middle part of the brain, just behind the frontal lobe. It plays a major role in processing sensory information and spatial awareness.

**🔑 Key Functions:**
- ✋ Touch & Sensation – processes pain, temperature, pressure 
- 📍 Spatial Awareness – helps understand position and movement in space 
- 🧠 Proprioception – awareness of body position 
- 🔢 Coordination of sensory input – integrates signals from different senses

#### 🧠 Temporal Lobe: 
The temporal lobe is located on the sides of the brain (near the ears) and is mainly responsible for hearing, memory, and language understanding.

**🔑 Key Functions:**
- 🔊 Hearing – processes sound via the auditory cortex 
- 🧠 Memory Formation – involves the hippocampus 
- 💬 Language Comprehension – controlled by Wernicke’s area 
- 🎭 Emotion Processing – linked to the amygdala

**Important Areas:**
- Primary Auditory Cortex → sound processing 
- Wernicke’s Area → understanding speech 
- Hippocampus → memory formation 
- Amygdala → emotions 

![Temporal Lobe diagram](/images/anatomy/anatomy36.webp)
![Temporal Lobe diagram](/images/anatomy/anatomy37.webp)
`
  },
  {
    id: 5,
    title: 'Gray Matter and White Matter in the Brain',
    content: `
### Gray Matter and White Matter in the Brain: 
The brain is made up of two main types of tissue: gray matter and white matter. These tissues differ in both their appearance and their roles in brain function. 

![Brain tissue diagram](/images/anatomy/anatomy38.webp)
![Brain tissue diagram](/images/anatomy/anatomy39.webp)

#### 🧠 Gray Matter: 
Gray matter forms the outer layer of the brain, known as the cerebral cortex. It appears darker due to the presence of nerve cell bodies. This part of the brain is responsible for many essential activities such as controlling movement, processing sensory information, memory, emotions, and speech. It plays a key role in everyday thinking and actions.

- Contains neuron cell bodies, dendrites, and synapses 
- Found in: 
  - Cerebral cortex (outer layer of brain) 
  - Basal ganglia, thalamus, etc. 
- Functions: 
  - 🧠 Information processing 
  - 💭 Thinking, memory, decision-making 
  - 🎯 Muscle control

![Gray Matter diagram](/images/anatomy/anatomy40.webp)

#### 🧠 White Matter: 
White matter is the part of the brain made up of myelinated nerve fibers (axons) that connect different brain regions and enable fast communication.

**🔑 Key Features:**
- ⚪ Composed of: 
  - Axons (nerve fibers) 
  - Myelin sheath (gives white color) 
- 📍 Location: 
  - Beneath the gray matter (cortex) 
  - Deep brain structures

**🧠 Important Structures:**
- Corpus Callosum → connects left & right hemispheres 
- Internal Capsule → carries motor & sensory signals 
- Association Fibers → connect regions within same hemisphere 
- Commissural Fibers → connect both hemispheres

![White Matter diagram](/images/anatomy/anatomy41.webp)
![White Matter diagram](/images/anatomy/anatomy42.webp)
`
  },
  {
    id: 6,
    title: 'How Many Brain Cells Does a Human Have?',
    content: `
### How Many Brain Cells Does a Human Have?
The human brain contains approximately 86 billion neurons, which are specialized cells responsible for communication within the nervous system. In addition to neurons, there are a similar number of glial cells, which support and protect brain function.

#### ⚡ Neurons:
Neurons are the primary signaling cells of the brain. They transmit information using electrical impulses and chemical signals, allowing different parts of the brain and body to communicate effectively.

**🔑 Structure of a Neuron:**
- 🌿 Dendrites → receive signals from other neurons 
- 🧠 Cell Body (Soma) → processes information 
- ⚡ Axon → carries signals away from the cell body 
- 🧵 Myelin Sheath → speeds up signal transmission 
- 🔗 Synapse → junction between neurons

**🧠 Types of Neurons:**
- 🔹 Sensory Neurons → carry signals from body to brain 
- 🔹 Motor Neurons → send signals from brain to muscles 
- 🔹 Interneurons → connect neurons within the brain & spinal cord

![Neuron structure diagram](/images/anatomy/anatomy43.webp)

#### 🧠 Glial Cells:
Glial cells, also known as neuroglia, provide essential support to neurons. They help maintain the brain’s environment, supply nutrients, and form myelin, a fatty covering that insulates nerve fibers and improves signal transmission.

**🔑 Main Types & Functions:**

**⭐ Astrocytes**
- Maintain blood–brain barrier 
- Provide nutrients to neurons 
- Regulate chemical environment 

**⚡ Oligodendrocytes**
- Form myelin sheath in the CNS 
- Increase speed of nerve signal transmission 

**🛡️ Microglia**
- Act as immune cells of the brain 
- Remove debris and fight infections 

**💧 Ependymal Cells**
- Line brain ventricles 
- Help produce & circulate cerebrospinal fluid (CSF)

**🧠 Key Roles of Glial Cells:**
- 🔧 Structural support 
- ⚡ Improve signal transmission 
- 🛡️ Defense & immune response 
- 🔄 Repair and maintenance of nervous tissue

![Glial Cells role diagram](/images/anatomy/anatomy44.webp)

#### ⚖️ How Much Does the Human Brain Weigh?: 
- The average adult brain weighs about 3 pounds (≈1.3–1.4 kg) 
- At birth, the brain weighs roughly 1 pound (≈0.45 kg) 
- During childhood, it grows to around 2 pounds (≈0.9 kg) before reaching full size 

Brain weight can vary depending on factors such as body size 

![Brain Weight diagram](/images/anatomy/anatomy45.webp)
![Brain Weight diagram](/images/anatomy/anatomy46.webp)
`
  },
  {
    id: 7,
    title: 'Conditions and Disorders Affecting the Brain',
    content: `
### 🧠 Conditions and Disorders Affecting the Brain
The brain controls nearly all functions of the body, so disorders affecting it are quite common. These conditions can range from mild to severe and may develop over time or be present from birth. Each disorder affects the brain differently, depending on the area involved.

#### 🧠 Neurodegenerative Conditions: 
- Alzheimer’s disease & Dementia – Conditions that gradually impair memory, thinking, and daily functioning. 
- Amyotrophic lateral sclerosis (ALS) – A progressive disease that damages nerve cells controlling voluntary muscles. 
- Parkinson’s disease – Affects movement, causing tremors, stiffness, and slow motion. 

![Neurodegenerative diagram](/images/anatomy/anatomy47.webp)

#### 🧠 Developmental and Mental Health Conditions: 
- Autism spectrum disorder (ASD) – Influences communication, behavior, and social interaction. 
- Depression – A mental health condition affecting mood, energy, and overall well-being.

#### 🧠 Structural and Injury-Related Conditions: 
- Brain hemorrhage – Bleeding within or around the brain. 
- Brain tumor – An abnormal growth of cells inside the brain. 
- Concussion – A temporary brain injury caused by impact. 
- Traumatic brain injury – Damage to the brain due to external force.

![Structural conditions diagram](/images/anatomy/anatomy48.webp)

#### ⚡ Neurological Disorders: 
- Epilepsy – Causes repeated seizures due to abnormal brain activity. 
- Multiple sclerosis – A condition where the immune system damages the protective covering of nerves. 
- Stroke – Occurs when blood flow to part of the brain is interrupted or reduced.

![Neurological Disorders diagram 1](/images/anatomy/anatomy49.webp)
![Neurological Disorders diagram 2](/images/anatomy/anatomy50.webp)
![Neurological Disorders diagram 3](/images/anatomy/anatomy51.webp)

#### Key Points to Understand
- Brain disorders can be present at birth (congenital) or develop later (acquired) 
- Symptoms vary widely depending on the condition 
- Commonly affected functions include: 
  - Memory 
  - Movement 
  - Thinking and reasoning 
  - Speech and language 
  - Emotional and mental health
`
  }
];

export function AnatomyPage() {
  const navigate = useNavigate();

  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [activeTopic, setActiveTopic] = useState<AnatomyTopic | null>(topics[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const completedCount = completedIds.size;
  const totalTopics = topics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const markComplete = () => {
    if (activeTopic) {
      setCompletedIds((prev) => new Set(prev).add(activeTopic.id));
      const currentIndex = topics.findIndex((t) => t.id === activeTopic.id);
      const nextTopic = topics[currentIndex + 1];
      if (nextTopic) setActiveTopic(nextTopic);
    }
  };

  const isActiveTopicComplete = activeTopic ? completedIds.has(activeTopic.id) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* ── Top Bar ───────────────────────────────────────── */}
      <header className="relative z-10 flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-purple-300 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-2 min-w-0">
          <Brain className="text-purple-400 shrink-0" size={18} />
          <h1 className="text-white font-bold truncate text-sm sm:text-base">
            Anatomy
          </h1>
        </div>
        {/* Progress pill */}
        <div className="ml-auto shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1">
          <span className="text-xs text-purple-300 font-medium">
            {completedCount}/{totalTopics} topics
          </span>
          <span className="text-xs font-bold text-white">{progressPercent}%</span>
        </div>
      </header>

      {/* ── Main Split Layout ──────────────────────────────── */}
      <div className="relative z-10 flex flex-col-reverse lg:flex-row gap-0">
        
        {/* ── LEFT: Topics Sidebar ──────────────────────── */}
        <aside className="lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-r border-white/10">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} />
              Anatomy Topics
            </h2>
          </div>

          <nav className="p-2 space-y-1">
            {topics.map((topic, index) => {
              const isActive = activeTopic?.id === topic.id;
              const isDone = completedIds.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopic(topic);
                    if (window.innerWidth < 1024) window.scrollTo(0, 0);
                  }}
                  className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-white/15 border border-white/20'
                    : 'hover:bg-white/10 border border-transparent'
                    }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-green-400" />
                    ) : (
                      <Circle
                        size={18}
                        className={isActive ? 'text-purple-300' : 'text-white/30 group-hover:text-purple-400'}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isActive ? 'text-purple-300' : 'text-white/40'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className={`text-sm font-medium leading-snug mt-0.5 ${isActive ? 'text-white' : 'text-purple-200 group-hover:text-white'}`}>
                      {topic.title}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className="text-purple-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── RIGHT: Topic Content ─────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTopic && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Header Card */}
              <Card className="bg-white/10 backdrop-blur-sm border border-white/15 shadow-xl">
                <CardHeader className="pb-3">
                  {isActiveTopicComplete && (
                    <div className="flex items-center gap-2 text-xs text-green-400 mb-2">
                      <CheckCircle2 size={12} />
                      <span>Completed</span>
                    </div>
                  )}
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {activeTopic.title}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Body Card */}
              <Card className="bg-white/8 backdrop-blur-sm border border-white/12">
                <CardContent className="pt-6 pb-6">
                  <div className="prose prose-invert max-w-none
                    prose-headings:text-white prose-headings:font-bold
                    prose-p:text-purple-100 prose-p:leading-relaxed
                    prose-strong:text-white
                    prose-ul:text-purple-100 prose-ul:list-disc prose-ul:ml-6
                    prose-ol:text-purple-100 prose-ol:list-decimal prose-ol:ml-6
                    prose-li:text-purple-100 prose-li:marker:text-purple-400
                    prose-code:text-purple-200 prose-code:bg-white/10 prose-code:rounded prose-code:px-1">
                    <ReactMarkdown
                      components={{
                        img: (props) => (
                          <img
                            src={props.src}
                            alt={props.alt || 'Anatomy diagram'}
                            loading="lazy"
                            className="w-full max-w-xl mx-auto my-4 rounded-lg"
                            onError={(e) => {
                              console.error("Image failed:", e.currentTarget.src);
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )
                      }}
                    >
                      {activeTopic.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {isActiveTopicComplete ? (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
                    <CheckCircle2 size={18} />
                    Topic Completed
                  </div>
                ) : (
                  <Button
                    onClick={markComplete}
                    className="h-11 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <CheckCircle2 size={16} />
                    Mark as Completed
                  </Button>
                )}

                {/* Next Button */}
                {(() => {
                  const currentIndex = topics.findIndex((t) => t.id === activeTopic.id);
                  const nextTopic = topics[currentIndex + 1];
                  return nextTopic ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTopic(nextTopic);
                        window.scrollTo(0, 0);
                      }}
                      className="h-11 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-semibold"
                    >
                      Next Topic
                      <ChevronRight size={16} />
                    </Button>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default AnatomyPage;
