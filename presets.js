// presets.js - Your saved portfolio repository of 7 poses and rules
export const savedPoses = [
  { 
    id: 1, 
    name: "Pose 1: Hand Pinch Location", 
    prompt: "IMAGE A = PRODUCT SOURCE. IMAGE B = EMPTY LIFESTYLE TEMPLATE. Extract ring from Image A and preserve exactly: gemstone shape, dimensions, bezel design, setting, and band thickness. The ring must remain physically identical to Image A. Use Image B only for hand pose, hand position, and background. Place the ring naturally between the thumb and index finger, matching the exact pinch position, scale, perspective, and finger alignment shown in Template Image B.",
    refImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Convert your uploaded 1.png to base64 here
  },
  { 
    id: 2, 
    name: "Pose 2: Ring On Stone (Front View)", 
    prompt: "TEMPLATE 2 — Ring On Stone (Front View). Use the ring exactly as shown in Image A. Image A is the authoritative reference for ring scale. The ring dimensions, gemstone dimensions, bezel dimensions, band thickness, and overall proportions must match Image A exactly. Do not resize or enlarge. Use Image B only for the stone, background, lighting, and composition.",
    refImage: "data:image/png;base64,R0lGODlhAQABA..." // Convert your uploaded 2.png to base64 here
  },
  { 
    id: 3, 
    name: "Pose 3: Stone Side View Profile", 
    prompt: "TEMPLATE 3 — STONE SIDE VIEW. Use the exact ring from Image A. Place the ring on the center of the stone. Match the side-profile presentation shown in Image B. The ring must face LEFT exactly as shown in Image B. Show the ring from a true side-profile angle. Gemstone viewed primarily from its side edge, band extending toward the right. Use backdrop only for stone surface, background, and lighting.",
    refImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Convert your uploaded 3.png to base64 here
  },
  { 
    id: 4, 
    name: "Pose 4: Open Fingers Alignment", 
    prompt: "IMAGE A = PRODUCT SOURCE. IMAGE B = EMPTY LIFESTYLE TEMPLATE. Analyze and extract the ring from Image A. Preserve metal color, texture, and craftsmanship details exactly. Place the ring naturally on the center finger, positioned exactly where a real ring would sit at the finger base, matching the exact scale, perspective, finger placement, and framing shown in Template Image B.",
    refImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Convert your uploaded 4.png to base64 here
  },
  { 
    id: 5, 
    name: "Pose 5: Cupped Hands Protection", 
    prompt: "IMAGE A = PRODUCT SOURCE. IMAGE B = EMPTY LIFESTYLE TEMPLATE. The ring must maintain realistic real-world jewelry dimensions. Never make the ring visually dominant or oversized. Place the ring naturally on the upper hand's ring finger, matching the exact hand overlap, scale, perspective, finger placement, and overall composition shown in Template Image B.",
    refImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Convert your uploaded 5.png to base64 here
  },
  { 
    id: 6, 
    name: "Pose 6: Rose Stalk Interaction", 
    prompt: "IMAGE A = PRODUCT SOURCE. IMAGE B = EMPTY LIFESTYLE TEMPLATE. Extract ring from Image A. Do not redesign, regenerate, or modify. Place the ring naturally on the ring finger while preserving the white rose interaction, matching the exact scale, perspective, finger position, hand angle, and composition shown in Template Image B. Ensure realistic contact shadows and lighting.",
    refImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Convert your uploaded 6.png to base64 here
  },
  { 
    id: 7, 
    name: "Pose 7: Shoulder Grace Overlook", 
    prompt: "IMAGE A = PRODUCT SOURCE. IMAGE B = EMPTY LIFESTYLE TEMPLATE. The ring must remain physically identical to Image A. Maintain realistic real-world dimensions. Place the ring naturally on the ring finger near the collarbone pose, matching the exact scale, perspective, hand position, finger angle, and framing shown in Template Image B. Look like a real DSLR jewelry photograph.",
    refImage: "data:image/png;base64,iVBORw0KGgoAAA..." // Convert your uploaded 7.png to base64 here
  }
];
