import { EquipmentItem, ProjectAccessRequest, Department } from './types';

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  // 1. Computer Science & AI
  {
    id: 'eq-cs-01',
    name: 'NVIDIA DGX A100 8-GPU Deep Learning Node',
    category: 'Workstation',
    department: 'Computer Science & AI',
    labLocation: 'Alan Turing AI Centre, Room 402, Block A',
    description: 'Enterprise AI computing powerhouse for LLM fine-tuning, computer vision architectures, and multi-modal neural network training.',
    specs: {
      'Compute': '8x NVIDIA A100 (640GB GPU VRAM)',
      'CPU': 'Dual AMD EPYC 7742 (128 Cores)',
      'RAM': '2TB DDR4-3200',
      'Storage': '30TB NVMe Cache',
      'CUDA Version': '12.4 Supported'
    },
    tags: ['GPU', 'Deep Learning', 'PyTorch', 'TensorFlow', 'LLM', 'AI Workstation'],
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Moderate',
    custodianFaculty: 'Dr. Aris Thorne',
    custodianEmail: 'a.thorne@campus.edu',
    totalHoursBookedThisMonth: 182,
    equivalentItemIds: ['eq-rob-02', 'eq-cs-02']
  },
  {
    id: 'eq-cs-02',
    name: 'NVIDIA RTX 4090 Dual-Station AI Rig',
    category: 'Workstation',
    department: 'Computer Science & AI',
    labLocation: 'Distributed Systems Lab, Room 310, Block A',
    description: 'High-speed dual GPU workstation tuned for rapid inference benchmarking, synthetic dataset generation, and model quantization.',
    specs: {
      'Compute': '2x RTX 4090 24GB (48GB total)',
      'CPU': 'Intel Core i9-14900KS',
      'RAM': '128GB DDR5',
      'Storage': '4TB NVMe SSD'
    },
    tags: ['GPU', 'Inference', 'Quantization', 'CUDA', 'Workstation'],
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Basic',
    custodianFaculty: 'Dr. Evelyn Reed',
    custodianEmail: 'e.reed@campus.edu',
    totalHoursBookedThisMonth: 95,
    equivalentItemIds: ['eq-cs-01', 'eq-rob-02']
  },

  // 2. Electronics & Communication
  {
    id: 'eq-ece-01',
    name: 'Keysight 4-Channel 1GHz InfiniiVision Oscilloscope',
    category: 'Specialised Equipment',
    department: 'Electronics & Communication',
    labLocation: 'RF & Signal Processing Lab, Room 204, Block C',
    description: 'High-frequency digital storage oscilloscope for signal integrity debugging, CAN/SPI/I2C protocol decoding, and high-speed waveform analysis.',
    specs: {
      'Bandwidth': '1 GHz Real-Time',
      'Channels': '4 Analog + 16 Digital MSO',
      'Sample Rate': '5 GSa/s',
      'Memory Depth': '4 Mpts per channel'
    },
    tags: ['RF', 'Oscilloscope', 'Signal Integrity', 'Embedded Testing', 'Hardware Debug'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Moderate',
    custodianFaculty: 'Prof. Marcus Vance',
    custodianEmail: 'm.vance@campus.edu',
    totalHoursBookedThisMonth: 78,
    equivalentItemIds: ['eq-ece-02']
  },
  {
    id: 'eq-ece-02',
    name: 'Rohde & Schwarz 3.2GHz Spectrum Analyzer',
    category: 'Specialised Equipment',
    department: 'Electronics & Communication',
    labLocation: 'RF & Microwave Research Annex, Room 108, Block C',
    description: 'RF spectral emissions measurement, harmonic analysis, wireless antenna gain validation, and EMI pre-compliance debugging.',
    specs: {
      'Frequency Range': '9 kHz to 3.2 GHz',
      'Resolution Bandwidth': '1 Hz to 3 MHz',
      'Phase Noise': '-100 dBc/Hz @ 100 kHz',
      'Preamplifier': 'Integrated 20 dB gain'
    },
    tags: ['RF', 'Spectrum Analyzer', 'Microwave', 'Wireless', 'Antenna', 'EMI'],
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Moderate',
    custodianFaculty: 'Prof. Marcus Vance',
    custodianEmail: 'm.vance@campus.edu',
    totalHoursBookedThisMonth: 64,
    equivalentItemIds: ['eq-ece-01']
  },
  {
    id: 'eq-ece-03',
    name: 'AMD Xilinx Zynq UltraScale+ MPSoC Development Kit',
    category: 'Development Kit',
    department: 'Electronics & Communication',
    labLocation: 'VLSI & Embedded Systems Suite, Room 215, Block C',
    description: 'Heterogeneous ARM + FPGA development platform with quad ARM Cortex-A53, dual Cortex-R5, and 16nm programmable logic fabric for custom DSP and neural accelerators.',
    specs: {
      'Logic Cells': '256K System Logic Cells',
      'Processor': 'Quad-Core Cortex-A53 + Mali-400 GPU',
      'Memory': '4GB DDR4 Component Memory',
      'Interfaces': 'Gigabit Ethernet, PCIe Gen2, SFP+ optical'
    },
    tags: ['FPGA', 'Verilog', 'VHDL', 'Embedded', 'Zynq', 'DSP'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Basic',
    custodianFaculty: 'Dr. Priya Sharma',
    custodianEmail: 'p.sharma@campus.edu',
    totalHoursBookedThisMonth: 42,
    equivalentItemIds: ['eq-rob-01']
  },

  // 3. Robotics & Automation
  {
    id: 'eq-rob-01',
    name: 'NVIDIA Jetson Orin Nano 8GB Developer Kit (x4 Bench Pack)',
    category: 'Development Kit',
    department: 'Robotics & Automation',
    labLocation: 'Autonomous Systems & Drones Lab, Room 102, Block E',
    description: 'Edge AI robotics computer capable of running ROS2, SLAM, edge perception models, and real-time sensor fusion with 40 TOPS AI compute.',
    specs: {
      'AI Performance': '40 TOPS Ampere Architecture',
      'Memory': '8GB 128-bit LPDDR5 (68 GB/s)',
      'Power': '7W to 15W configurable',
      'Camera': '2x MIPI CSI-2 22-pin connectors'
    },
    tags: ['Robotics', 'Jetson', 'Edge AI', 'ROS2', 'Autonomous', 'Computer Vision'],
    imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Basic',
    custodianFaculty: 'Dr. Henrik Lindqvist',
    custodianEmail: 'h.lindqvist@campus.edu',
    totalHoursBookedThisMonth: 110,
    equivalentItemIds: ['eq-ece-03']
  },
  {
    id: 'eq-rob-02',
    name: 'Universal Robots UR5e 6-Axis Collaborative Robotic Arm Workstation',
    category: 'Workstation',
    department: 'Robotics & Automation',
    labLocation: 'Industrial Mechatronics Bay, Room 105, Block E',
    description: 'Precision 6-DOF cobot arm with integrated force-torque sensor, safety-rated soft stop, and Python/ROS control interface for kinematic manipulation projects.',
    specs: {
      'Payload': '5 kg (11 lbs)',
      'Reach': '850 mm radius',
      'Repeatability': '+/- 0.03 mm',
      'Safety': 'ISO 10218-1 Certified Collision Sensing'
    },
    tags: ['Robotics', 'Cobot', 'Kinematics', 'Mechatronics', 'Automation'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'High (Certified Only)',
    custodianFaculty: 'Dr. Henrik Lindqvist',
    custodianEmail: 'h.lindqvist@campus.edu',
    totalHoursBookedThisMonth: 88,
    equivalentItemIds: []
  },
  {
    id: 'eq-rob-03',
    name: 'Markforged Onyx Pro Continuous Carbon Fiber 3D Printer',
    category: 'Specialised Equipment',
    department: 'Robotics & Automation',
    labLocation: 'Rapid Prototyping Foundry, Room 112, Block E',
    description: 'Industrial composite 3D printer reinforced with continuous fiberglass and carbon fiber micro-strands for structural drone and robotic chassis fabrication.',
    specs: {
      'Build Volume': '320 x 132 x 154 mm',
      'Layer Height': '100 micron (0.1 mm)',
      'Materials': 'Onyx (Nylon-Carbon), Continuous Fiberglass',
      'Tensile Strength': 'Exceeds 6061-T6 Aluminum equivalents'
    },
    tags: ['3D Printing', 'Carbon Fiber', 'Prototyping', 'Additive Manufacturing', 'Fabrication'],
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'Moderate',
    custodianFaculty: 'Prof. Sean O\'Connor',
    custodianEmail: 's.oconnor@campus.edu',
    totalHoursBookedThisMonth: 145,
    equivalentItemIds: []
  },

  // 4. Biotechnology & Materials
  {
    id: 'eq-bio-01',
    name: 'Bio-Rad CFX96 Touch Real-Time PCR Detection System',
    category: 'Specialised Equipment',
    department: 'Biotechnology & Materials',
    labLocation: 'Molecular Biology Research Core, Room 301, Block D',
    description: 'Six-channel thermal cycler for quantitative real-time PCR, gene expression profiling, genomic pathogen detection, and multiplex fluorescent assays.',
    specs: {
      'Sample Capacity': '96 wells, 0.2 ml tubes or 96-well plate',
      'Detection': 'Photodiode array + Filter sets (HEX, FAM, Cy5, ROX)',
      'Thermal Uniformity': '+/- 0.4°C across all wells',
      'Dynamic Range': '10 orders of magnitude'
    },
    tags: ['PCR', 'Genomics', 'Biotech', 'DNA', 'Thermal Cycler', 'Bio-Rad'],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'High (Certified Only)',
    custodianFaculty: 'Dr. Clara Montero',
    custodianEmail: 'c.montero@campus.edu',
    totalHoursBookedThisMonth: 120,
    equivalentItemIds: []
  },
  {
    id: 'eq-bio-02',
    name: 'Agilent 1260 Infinity II HPLC Analytical System',
    category: 'Specialised Equipment',
    department: 'Biotechnology & Materials',
    labLocation: 'Analytical Chemistry Core, Room 314, Block D',
    description: 'High-Performance Liquid Chromatography system with diode array UV-Vis detector for pharmaceutical compound quantification and biochemical purification.',
    specs: {
      'Operating Pressure': 'Up to 600 bar',
      'Flow Range': '0.05 to 5.0 mL/min',
      'Autosampler': '132 vial temperature-controlled tray',
      'Wavelength Range': '190 to 950 nm'
    },
    tags: ['HPLC', 'Chromatography', 'Chemistry', 'Purification', 'Bio-analytics'],
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'High (Certified Only)',
    custodianFaculty: 'Dr. Clara Montero',
    custodianEmail: 'c.montero@campus.edu',
    totalHoursBookedThisMonth: 110,
    equivalentItemIds: []
  },

  // 5. Applied Physics & Nanotech
  {
    id: 'eq-phy-01',
    name: 'Phenom XL Desktop Scanning Electron Microscope (SEM)',
    category: 'Specialised Equipment',
    department: 'Applied Physics & Nanotech',
    labLocation: 'Nanomaterials Characterization Lab, Room 101, Block B',
    description: 'High-vacuum desktop SEM with integrated Energy Dispersive X-ray Spectroscopy (EDS) for sub-micron surface topography and elemental micro-analysis.',
    specs: {
      'Resolution': '< 14 nm at 15 kV',
      'Magnification': 'Up to 100,000x',
      'Detector': 'Backscattered Electron (BSE) + Secondary Electron (SE)',
      'EDS Detector': 'Silicon Drift Detector for elemental mapping (B to Am)'
    },
    tags: ['SEM', 'Electron Microscope', 'Nanotechnology', 'Materials Science', 'EDS'],
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    safetyLevel: 'High (Certified Only)',
    custodianFaculty: 'Prof. Nathan Gallagher',
    custodianEmail: 'n.gallagher@campus.edu',
    totalHoursBookedThisMonth: 160,
    equivalentItemIds: []
  }
];

export const INITIAL_REQUESTS: ProjectAccessRequest[] = [
  // A realistic conflict scenario on the NVIDIA DGX A100 Workstation (eq-cs-01) for Tomorrow 10:00 - 14:00:
  {
    id: 'req-001',
    studentId: 'STU-2024-8841',
    studentName: 'Zubair Patel',
    studentEmail: 'z.patel@student.campus.edu',
    studentDepartment: 'Computer Science & AI',
    projectTitle: 'Real-time Autonomous Surgical Instrument Segmentation',
    projectDescription: 'Training a 3D-UNet with Vision Transformer backbone on 15,000 laparoscopic video frames for our final year capstone thesis deadline.',
    projectCategory: 'Capstone / Final Year Thesis',
    facultyAdvisor: 'Dr. Aris Thorne',
    projectDeadline: '2026-11-25', // Impending deadline: 2 days away!
    urgency: 'Critical (<= 48h)',
    equipmentId: 'eq-cs-01',
    requestedSlot: {
      date: '2026-11-24',
      startTime: '10:00',
      endTime: '14:00'
    },
    prerequisiteTrainingCompleted: true,
    status: 'Conflicted',
    studentUsageHoursPastMonth: 12,
    createdAt: '2026-11-23T08:15:00Z'
  },
  {
    id: 'req-002',
    studentId: 'STU-2025-1032',
    studentName: 'Ananya Deshmukh',
    studentEmail: 'a.deshmukh@student.campus.edu',
    studentDepartment: 'Electronics & Communication',
    projectTitle: 'Audio Generation using Diffusion Latents (Club Hackathon)',
    projectDescription: 'Experimenting with latent diffusion models for music stem generation for the upcoming campus hackathon showcase next month.',
    projectCategory: 'Student Club / Innovation Contest',
    facultyAdvisor: 'Prof. Marcus Vance',
    projectDeadline: '2026-12-18', // Deadline: 3.5 weeks away
    urgency: 'Low (> 2 weeks)',
    equipmentId: 'eq-cs-01',
    requestedSlot: {
      date: '2026-11-24',
      startTime: '10:00',
      endTime: '14:00'
    },
    prerequisiteTrainingCompleted: true,
    status: 'Conflicted',
    studentUsageHoursPastMonth: 38, // High past usage!
    createdAt: '2026-11-23T09:00:00Z'
  },

  // Another request pending faculty approval
  {
    id: 'req-003',
    studentId: 'STU-2024-4419',
    studentName: 'Liam Chen',
    studentEmail: 'l.chen@student.campus.edu',
    studentDepartment: 'Robotics & Automation',
    projectTitle: 'Autonomous Greenhouse Quadcopter Flight Controller Validation',
    projectDescription: 'Bench testing ROS2 motor controllers and real-time lidar obstacle avoidance on the Jetson Orin Nano bench pack.',
    projectCategory: 'Funded Research Grant',
    facultyAdvisor: 'Dr. Henrik Lindqvist',
    projectDeadline: '2026-11-29',
    urgency: 'High (<= 1 week)',
    equipmentId: 'eq-rob-01',
    requestedSlot: {
      date: '2026-11-25',
      startTime: '14:00',
      endTime: '17:00'
    },
    prerequisiteTrainingCompleted: true,
    status: 'Pending Approval',
    studentUsageHoursPastMonth: 10,
    createdAt: '2026-11-23T11:20:00Z'
  },

  // Approved request
  {
    id: 'req-004',
    studentId: 'STU-2024-7731',
    studentName: 'Maya Sen',
    studentEmail: 'm.sen@student.campus.edu',
    studentDepartment: 'Biotechnology & Materials',
    projectTitle: 'MicroRNA Biomarker Quantification in Breast Cancer Cell Lines',
    projectDescription: 'Conducting SYBR Green quantitative fluorescence assays using the CFX96 real-time PCR instrument.',
    projectCategory: 'Capstone / Final Year Thesis',
    facultyAdvisor: 'Dr. Clara Montero',
    projectDeadline: '2026-12-05',
    urgency: 'Medium (<= 2 weeks)',
    equipmentId: 'eq-bio-01',
    requestedSlot: {
      date: '2026-11-26',
      startTime: '09:00',
      endTime: '12:00'
    },
    prerequisiteTrainingCompleted: true,
    status: 'Approved',
    approvalNotes: 'Approved. Biological safety protocol signed and waste disposal bag verified.',
    studentUsageHoursPastMonth: 18,
    createdAt: '2026-11-22T14:10:00Z'
  }
];
