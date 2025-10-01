const categories = {
  beauty_cosmetics: {
    label: 'Beauty & Cosmetics',
    subcategories: [
      { id: 'beauty_cosmetics_makeup', label: 'Makeup' },
      { id: 'beauty_cosmetics_skincare', label: 'Skincare' },
      { id: 'beauty_cosmetics_fragrances', label: 'Fragrances' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Acrylic_Display',
          title: 'Hero set on acrylic pedestals',
          description: 'Skincare, makeup, or perfume displayed on clear blocks with soft lighting.',
          prompt:
            'Create a premium studio hero photograph of my beauty products (makeup, skincare, or fragrance) arranged on clear acrylic risers against a warm beige seamless background. Soft directional lighting reveals packaging gloss while gentle shadows add depth. No people, no text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_TopDown_Grid',
          title: 'Top-down routine flat lay',
          description: 'Organized flat lay of beauty products on a clean backdrop.',
          prompt:
            'Generate a top-down flatlay of my beauty routine organized in a tidy grid on a light stone surface. Include complementary props such as makeup brushes and cotton pads with diffused daylight and minimal shadows. No text or extraneous elements.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Perfume_Glow',
          title: 'Perfume spotlight highlight',
          description: 'Perfume bottle with a dramatic light accent and reflection.',
          prompt:
            'Produce a dramatic studio shot of my perfume or luxury skincare serum bottle on a glossy reflective surface. Backlight to create a halo mist behind the product and keep the environment minimalist. No text or watermarks.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Color_Wash',
          title: 'Color-washed product podium',
          description: 'Beauty assortment on color-blocked pedestals with gradient lighting.',
          prompt:
            'Photograph my beauty products arranged on geometric pedestals with a soft color-washed gradient wall behind them. Use rim lighting to define the silhouettes and keep the scene ultra-clean. No people, no typography.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Mirror_Reflection',
          title: 'Mirror reflection hero',
          description: 'Cosmetics placed on mirrored surfaces with crisp highlights.',
          prompt:
            'Create a luxurious studio hero shot of my cosmetics placed on layered mirror panels that create elegant reflections. Balance cool and warm highlights to emphasize premium finishes. No text or extra props.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Vanity_Morning',
          title: 'Morning vanity routine',
          description: 'Beauty products on a vanity table with gentle morning light.',
          prompt:
            'Create a lifestyle photo of my beauty products arranged on a styled vanity with a mirror, flower, and linen cloth. Soft morning window light from the right and a gently blurred background. No faces, no text.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Spa_Bathroom',
          title: 'Bathroom spa moment',
          description: 'Skincare styled in a minimalist spa-inspired bathroom.',
          prompt:
            'Photograph my skincare set on a stone sink inside a spa-inspired bathroom with fresh towels and a plant in frame. Warm ambient lighting, focus on the products, no people, no text.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Bag_Flatlay',
          title: 'Beauty essentials in a bag',
          description: 'Makeup essentials spilling from an elegant bag onto fabric.',
          prompt:
            'Flatlay my makeup essentials spilling from an elegant bag onto neutral fabric with props like glasses, a notebook, and lipstick. Natural window light, soft shadows, no text or hands.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Bedside_Routine',
          title: 'Nightstand ritual moment',
          description: 'Skincare favorites styled on a bedside table with cozy light.',
          prompt:
            'Capture my skincare favorites on a wooden nightstand with a glowing lamp, book, and small vase of flowers suggesting a bedtime ritual. Shallow depth of field, warm cozy lighting, no people or text.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Bath_Towels',
          title: 'Spa towels and botanicals',
          description: 'Beauty products resting on stacked towels with greenery accents.',
          prompt:
            'Photograph my beauty lineup resting on stacked plush towels with eucalyptus leaves and candles in a spa-like bathroom setting. Soft diffused daylight, gentle steam atmosphere, no people or typography.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Texture_Swatch',
          title: 'Product texture macro',
          description: 'Macro view of a swatch or cream with emphasis on texture.',
          prompt:
            'Capture a macro view of my beauty product texture—smeared cream, powder, or pigment—on a neutral tile. Side lighting accentuates relief and color. No text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Dropper',
          title: 'Serum dropper close-up',
          description: 'Detail of a dropper with a serum droplet suspended.',
          prompt:
            'Close-up of a pipette releasing a drop of my skincare formula above its bottle. Crystal-clear focus on the droplet with soft diffused light and a blurred background. No text or hands.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Perfume_Atomizer',
          title: 'Fragrance hardware detail',
          description: 'Close-up of a perfume sprayer with a soft metal sheen.',
          prompt:
            'Macro detail of my perfume bottle sprayer and metal hardware lit from the side to create a soft glow without glare. Smooth neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Brush_Bristles',
          title: 'Brush bristle macro',
          description: 'Close-up of makeup brush bristles dusted with pigment.',
          prompt:
            'Capture a macro close-up of my makeup brush bristles coated in fine powder pigment with shallow depth of field and side lighting to highlight texture. Neutral background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Drop_Texture',
          title: 'Serum droplet ripple',
          description: 'Droplets forming ripples on a glossy liquid surface.',
          prompt:
            'Photograph a serum droplet creating ripples on a glossy liquid surface beside the product packaging. High-speed flash to freeze motion, soft gradient backdrop, no hands or text.',
        },
      ],
    },
  },
  health_supplements: {
    label: 'Health & Supplements',
    subcategories: [
      { id: 'health_supplements_vitamins', label: 'Vitamins' },
      { id: 'health_supplements_proteins', label: 'Protein Powders' },
      { id: 'health_supplements_dietary', label: 'Dietary Supplements' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Bottle_Lineup',
          title: 'Supplement lineup display',
          description: 'Vitamin bottles arranged in a neat rhythm with fresh lighting.',
          prompt:
            'Create a studio hero photograph of my supplements (vitamin bottles, protein tubs, capsule jars) arranged in a precise line on a bright seamless background. Soft side lighting highlights the labels and casts gentle shadows. No text or extra graphics.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Powder_Scoop',
          title: 'Protein with scoop',
          description: 'Protein powder with a scoop and a tidy mound of powder.',
          prompt:
            'Produce a studio setup featuring my protein powder container with the scoop heaped and a controlled sprinkle of powder on a matte surface. Neutral gray backdrop, diffused overhead light to reveal texture. No text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Capsule_Floating',
          title: 'Capsules in motion',
          description: 'Dynamic capsules appearing to float in front of the bottle.',
          prompt:
            'Generate a creative studio shot where several of my capsules appear to float in front of the bottle using invisible supports. Darker gradient background with a directional highlight to emphasize translucency. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Stacked_Tiers',
          title: 'Tiered supplement podium',
          description: 'Bottles staggered on cylindrical risers with nutrition props.',
          prompt:
            'Arrange my supplements on tiered cylindrical risers with small props like sliced citrus and herbs hinting at wellness benefits. Use crisp studio lighting and a clean pastel backdrop. No people or typography.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Backlight_Glow',
          title: 'Translucent backlit capsules',
          description: 'Capsules glowing on a light table with the bottle behind.',
          prompt:
            'Create a studio hero scene with my capsule bottle placed behind a shallow dish of capsules resting on a glowing light table. Capture the luminous translucency with a dark vignette background. No text elements.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Kitchen_Morning',
          title: 'Morning kitchen routine',
          description: 'Supplements beside a glass of water in a sunlit kitchen.',
          prompt:
            'Capture a lifestyle scene of my supplements on a kitchen counter beside a glass of water, fruit, and fresh herbs. Sunlight enters from the left, modern kitchen background softly blurred. No people, no text.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Gym_Bag',
          title: 'Workout-ready supplements',
          description: 'Protein powder and a shaker arranged beside a gym bag.',
          prompt:
            'Photograph my sports supplements next to an open gym bag with shaker bottles and towels on a rubber floor. Ambient gym lighting, focus on product labels. No people, no text.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Wellness_Desk',
          title: 'Desk wellness essentials',
          description: 'Vitamins styled with notes and a cup of tea.',
          prompt:
            'Lifestyle photograph of my vitamins on a worktable beside a notebook, glasses, and a cup of herbal tea. Warm daylight with a neatly blurred background. No people, no text.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Green_Smoothie',
          title: 'Smoothie bar setup',
          description: 'Supplements beside a blender and fresh produce.',
          prompt:
            'Photograph my supplements beside a freshly blended smoothie, leafy greens, and fruit on a kitchen island. Bright natural daylight, lifestyle styling, no people or written elements.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Nightstand',
          title: 'Evening supplement ritual',
          description: 'Vitamins on a nightstand with lamp light and a journal.',
          prompt:
            'Capture my evening supplements arranged on a nightstand with a glowing lamp, glass of water, and journal to suggest a bedtime routine. Warm cozy lighting, shallow depth of field, no people or text.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Tablet_Texture',
          title: 'Tablet texture detail',
          description: 'Macro look at the surface of a tablet or capsule.',
          prompt:
            'Macro detail of my tablets or capsules arranged on a matte surface with raking light to reveal texture and color. Background softly blurred. No text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Label_Close',
          title: 'Label in focus',
          description: 'Label detail highlighting typography and key information.',
          prompt:
            'Close-up of my supplement bottle label showing typography and finish. Controlled lighting to avoid glare, neutral background, no text overlays.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Powder_Texture',
          title: 'Powder texture macro',
          description: 'Macro view of protein or superfood powder.',
          prompt:
            'Capture a macro view of my powdered supplement scooped onto a smooth surface, emphasizing granules and sheen with side lighting. Background softly blurred. No text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Capsule_Split',
          title: 'Opened capsule detail',
          description: 'Capsule halves spilling powder with sharp focus.',
          prompt:
            'Photograph an opened capsule spilling powder across a reflective surface, focusing on texture and color with dramatic side light. Neutral blurred background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Lid_Seal',
          title: 'Bottle seal close-up',
          description: 'Close detail of tamper seal and threading.',
          prompt:
            'Capture a tight macro of my supplement bottle neck showing the tamper-evident seal and cap threading with specular highlights. Clean gradient background, no text.',
        },
      ],
    },
  },
  fitness_sport: {
    label: 'Fitness & Sport',
    subcategories: [
      { id: 'fitness_sport_equipment', label: 'Sports Equipment' },
      { id: 'fitness_sport_apparel', label: 'Training Apparel' },
      { id: 'fitness_sport_machines', label: 'Exercise Machines' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Gear_Set',
          title: 'Complete training gear',
          description: 'Workout accessories grouped on a monochromatic background.',
          prompt:
            'Create a studio hero shot of my fitness gear—dumbbells, resistance bands, mats—arranged on a matte floor with a subtle gradient background. Directional light from the side adds depth and crisp shadows. No people, no text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Apparel_Mannequin',
          title: 'Training outfit on mannequin',
          description: 'Sports apparel styled on a minimalist torso form.',
          prompt:
            'Photograph my training apparel on a minimalist mannequin or hanger system against a neutral seamless backdrop. Soft key light to reveal fabric structure and performance details. No text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Tread_Motion',
          title: 'Dynamic equipment hero',
          description: 'Fitness machine highlighted with accent light and strong lines.',
          prompt:
            'Produce a studio image of my cardio machine or fitness equipment (treadmill, bike, rower) with a slight motion streak created by rim lighting. Darker background, accent lighting on controls and frame. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Mat_Stack',
          title: 'Stacked mat and gear display',
          description: 'Fitness accessories layered on stacked mats with bold color.',
          prompt:
            'Arrange my fitness accessories—foam roller, blocks, bands—on stacked exercise mats with bold contrasting colors under punchy studio lighting. Keep the scene minimal with crisp shadows. No people or typography.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Spotlight_Dumbbell',
          title: 'Spotlit dumbbell hero',
          description: 'Single dumbbell or kettlebell under dramatic light and haze.',
          prompt:
            'Create a dramatic studio hero shot of my dumbbell or kettlebell on a textured floor with a single spotlight cutting through light haze. Emphasize metal highlights and power. No text elements.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Gym_Setup',
          title: 'Home gym corner',
          description: 'Equipment arranged in a modern home gym.',
          prompt:
            'Lifestyle photograph of my fitness equipment arranged in a minimalist home gym with a concrete wall, wall-mounted mirror, and organized shelving. Natural window light, focus on the gear, no people, no text.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Outdoor_Track',
          title: 'Outdoor training setup',
          description: 'Sports gear on a running track at sunset.',
          prompt:
            'Capture my sports equipment—running shoes, smart watch, water bottle—laid out on an athletics track at golden hour. Warm light, softly blurred background, no people, no text.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Yoga_LivingRoom',
          title: 'At-home wellness moment',
          description: 'Yoga equipment in a living room with natural light.',
          prompt:
            'Show my yoga or Pilates equipment on a rug in a bright living room with plants. Diffused natural light and a calming palette. No people, no text.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Garage_Gym',
          title: 'Garage gym vignette',
          description: 'Weights and bench inside an organized garage space.',
          prompt:
            'Photograph my strength equipment set up in a garage gym with concrete floor, wall storage, and soft daylight entering from the side. Focus on product arrangement, no people or text.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Park_Workout',
          title: 'Park workout preparation',
          description: 'Portable gear laid out on grass before exercising.',
          prompt:
            'Capture my portable fitness gear laid out on grass in a park with water bottle, jump rope, and resistance bands ready for use. Golden hour lighting, background softly blurred, no people or text.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Fabric_Tech',
          title: 'Technical fabric detail',
          description: 'Macro look at breathable performance fabric.',
          prompt:
            'Macro detail of my sportswear fabric highlighting mesh, ventilation zones, or reflective elements. Side lighting to emphasize texture. No text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Handle_Grip',
          title: 'Grip material close-up',
          description: 'Close-up of a handle or bar with emphasis on grip texture.',
          prompt:
            'Close-up of the handle on my fitness equipment focusing on grip material and metal finishing. Side lighting creates contrast against a dark background. No text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Control_Interface',
          title: 'Control panel detail',
          description: 'Detail of the display or controls on fitness equipment.',
          prompt:
            'Capture a macro view of the screen or controls on my fitness device with buttons and metrics sharp and legible. Soft lighting to avoid glare, blurred background. No text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Sole_Tread',
          title: 'Shoe tread macro',
          description: 'Close-up of athletic shoe tread pattern.',
          prompt:
            'Photograph a macro view of my athletic shoe outsole showing tread pattern and rubber texture with raking light for depth. Background softly blurred. No text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Band_Texture',
          title: 'Resistance band stretch',
          description: 'Band material stretched to show texture and branding.',
          prompt:
            'Capture a close-up of my resistance band stretched across a neutral background to highlight surface texture and tension. Use side lighting and shallow depth of field. No text.',
        },
      ],
    },
  },
  electronics: {
    label: 'Electronics',
    subcategories: [
      { id: 'electronics_smartphones', label: 'Smartphones' },
      { id: 'electronics_laptops', label: 'Laptops' },
      { id: 'electronics_tablets', label: 'Tablets' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Device_Gradient',
          title: 'Hero device on gradient',
          description: 'Phone, laptop, or tablet on an elegant gradient background.',
          prompt:
            'Create a studio hero photograph of my electronic device (phone, laptop, or tablet) centered on a smooth gradient backdrop. Subtle side lighting defines the edges and screen while reflections are carefully controlled. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Open_Device',
          title: 'Open device with screen focus',
          description: 'Laptop or tablet opened with a clean UI-ready screen.',
          prompt:
            'Capture my device opened at a three-quarter angle with a clean, empty screen ready for a UI mockup. Neutral seamless background, soft light from above and in front, shadows restrained. No text on the screen.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Floating_Set',
          title: 'Floating device set',
          description: 'Combination of devices in a dynamic floating composition.',
          prompt:
            'Generate a dynamic studio composition where my laptop, tablet, and phone appear to hover using hidden supports. Moody gradient background with accent lighting on slim profiles. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Screen_Glow',
          title: 'Illuminated screen hero',
          description: 'Device with glowing screen on reflective surface.',
          prompt:
            'Create a studio hero shot of my electronic device with its screen softly glowing atop a polished reflective surface. Balance cool backlighting and subtle rim lights to keep reflections clean. No UI or text on the display.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Disassembled_Set',
          title: 'Accessory flatlay hero',
          description: 'Device surrounded by key accessories in orderly layout.',
          prompt:
            'Arrange my primary device at center with its essential accessories—stylus, earbuds, charger—symmetrically laid out on a monochromatic backdrop. Use top-down lighting for crisp shadows. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Workspace',
          title: 'Minimalist workspace',
          description: 'Device on a tidy desk with natural daylight.',
          prompt:
            'Lifestyle scene showing my device on a minimalist desk with a notebook, plant, and coffee cup. Daylight from the window creates soft shadows and the modern interior background is softly blurred. Screen is empty, no text.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Couch_Relax',
          title: 'Living room tech moment',
          description: 'Tablet or laptop on a sofa styled with cozy details.',
          prompt:
            'Photograph my tablet or laptop resting on a cozy sofa with blankets and a warm beverage. Warm ambient light, background softly blurred, screen empty, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_OnTheGo',
          title: 'Technology on the go',
          description: 'Phone in an urban setting with controlled reflections.',
          prompt:
            'Capture my cellphone resting on a metal bench or concrete ledge with the city softly blurred behind it at golden hour. Highlights dance across the glass. No hands and no text on the screen.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Creative_Desk',
          title: 'Creative studio workspace',
          description: 'Device amidst sketchbooks, pens, and creative tools.',
          prompt:
            'Photograph my device on a designer’s desk with sketchbooks, stylus, and color swatches suggesting a creative workflow. Soft north light, background blurred, no on-screen content.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_CoffeeShop',
          title: 'Cafe productivity moment',
          description: 'Laptop or tablet on a café table with beverage.',
          prompt:
            'Capture my laptop or tablet on a rustic café table with a latte, notebook, and blurred patrons in the background. Warm ambient lighting, screen blank, no people in focus.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Port_Finish',
          title: 'Ports and finish detail',
          description: 'Close-up of ports and housing materials.',
          prompt:
            'Macro close-up of my device ports and casing materials, emphasizing brushed metal or glass edges with side lighting. Background dark and unobtrusive. No text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Camera_Module',
          title: 'Camera module focus',
          description: 'Rear camera detail with controlled reflections.',
          prompt:
            'Close-up of the rear camera module on my phone with controlled reflections and dust-free lenses. Soft light, softly blurred background. No text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Keyboard_Texture',
          title: 'Keyboard or touchpad detail',
          description: 'Macro of keys or touchpad with material emphasis.',
          prompt:
            'Macro detail of my laptop keyboard or touchpad highlighting key legends and surface texture. Raking light to show relief, background softly blurred. No text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Vent_Finish',
          title: 'Vent and chassis detail',
          description: 'Close-up of ventilation grilles or speaker mesh.',
          prompt:
            'Capture a macro shot of my device venting or speaker grille showing precision machining and finish. Use side lighting to reveal depth, dark background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Button_Profile',
          title: 'Button profile macro',
          description: 'Power or volume button with tactile detail.',
          prompt:
            'Photograph the power or volume button on my device at macro scale to highlight chamfers and tactile texture. Employ dramatic cross-lighting with blurred background. No text.',
        },
      ],
    },
  },
  mobile_accessories: {
    label: 'Mobile Accessories',
    subcategories: [
      { id: 'mobile_accessories_cases', label: 'Phone Cases' },
      { id: 'mobile_accessories_chargers', label: 'Chargers' },
      { id: 'mobile_accessories_audio', label: 'Headphones & Earbuds' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Case_Display',
          title: 'Case on pedestals',
          description: 'Phone case displayed on acrylic pedestals with the device.',
          prompt:
            'Create a studio hero image of my phone cases displayed on minimal acrylic stands against a soft gradient background. Controlled highlights showcase finishes without glare. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Charging_Set',
          title: 'Charger and cable set',
          description: 'Charger and cable neatly arranged on a matte surface.',
          prompt:
            'Photograph my charging accessories—cables, adapters, wireless pad—arranged symmetrically on a neutral surface with soft overhead light. Clean shadows, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Audio_Buds',
          title: 'Earbuds in charging case',
          description: 'Wireless earbuds and case on a reflective tabletop.',
          prompt:
            'Produce a studio shot of my wireless earbuds and charging case on a matte pedestal with a dark-to-light gradient background. Edge lighting defines form, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Color_Block',
          title: 'Color-blocked accessory lineup',
          description: 'Cases and straps arranged on bold color panels.',
          prompt:
            'Arrange my phone cases, straps, and grips on overlapping color-blocked panels under soft top lighting to highlight finishes and cutouts. Keep reflections minimal and no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Floating_Cables',
          title: 'Suspended cable hero',
          description: 'Charging cable forming arcs around the device.',
          prompt:
            'Create a studio hero image where my charging cable forms graceful arcs around the device using hidden supports. Use a dark gradient backdrop with rim lighting to accentuate curves. No people or typography.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Desk_Setup',
          title: 'Accessories on desk',
          description: 'Case and charger styled beside a laptop and notes.',
          prompt:
            'Lifestyle scene of my mobile accessories on a work desk beside a laptop, notebook, and plant. Natural daylight focuses on the products, no hands, no text.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Nightstand',
          title: 'Overnight charging',
          description: 'Charger and phone on a nightstand with a lamp.',
          prompt:
            'Capture my phone on a wireless charger with matching accessories on a nightstand styled with a lamp and book. Warm evening light, softly blurred background, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_OnTheGo',
          title: 'Accessories on the go',
          description: 'Case and earbuds spilling from a bag on a city bench.',
          prompt:
            'Photograph my phone accessories spilling from a tote or backpack on a city bench with an urban park softly blurred behind. Natural light, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_CarConsole',
          title: 'In-car charging scene',
          description: 'Accessories organized in a car console.',
          prompt:
            'Capture my phone accessories neatly arranged in a car console with ambient dashboard lighting and a blurred cityscape outside the windshield. Focus on products, no people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Bedside_Mood',
          title: 'Ambient bedside setup',
          description: 'Accessories styled with soft ambient lighting.',
          prompt:
            'Photograph my accessories on a bedside table with glowing smart light, book, and glasses to suggest a nighttime routine. Warm moody lighting, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Case_Texture',
          title: 'Case texture detail',
          description: 'Macro of the case material and edges.',
          prompt:
            'Macro close-up of my phone case material highlighting grip texture or stitching. Raking light shows detail, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Cable_Connector',
          title: 'Charger connector close-up',
          description: 'Close-up of the connector with a clean metallic sheen.',
          prompt:
            'Close-up of my charging cable connector focusing on metal contacts and braided sleeve. Controlled lighting, dark background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Buds_Close',
          title: 'Earbud detail',
          description: 'Macro look at the earbuds highlighting mesh and LEDs.',
          prompt:
            'Macro detail of my wireless earbud showing mesh grille and finish. Soft diffused light, blurred background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_MagSafe_Ring',
          title: 'Magnetic ring close-up',
          description: 'Detail of magnetic alignment rings or plates.',
          prompt:
            'Capture a macro view of my magnetic charging ring or plate on the back of a case showing precision edges and texture. Use side lighting, neutral background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Cable_Braid',
          title: 'Braided cable texture',
          description: 'Macro of braided cable fibers under soft light.',
          prompt:
            'Photograph the braided sleeve of my charging cable at macro scale with shallow depth of field to highlight weave pattern. Subtle gradient backdrop, no text.',
        },
      ],
    },
  },
  computing_gaming: {
    label: 'Computing & Gaming',
    subcategories: [
      { id: 'computing_gaming_keyboards', label: 'Keyboards' },
      { id: 'computing_gaming_mice', label: 'Mice & Accessories' },
      { id: 'computing_gaming_consoles', label: 'Consoles & Games' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Setup_RGB',
          title: 'RGB gaming rig',
          description: 'Keyboard, mouse, and headset on a dramatically lit background.',
          prompt:
            'Create a studio hero shot of my gaming PC setup with tower, monitor, keyboard, and RGB lighting staged on a reflective surface. Dark background with vibrant accent lights, no text on screens.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Console_Duo',
          title: 'Console and controllers',
          description: 'Console with dual controllers on a clean background.',
          prompt:
            'Photograph my console and controller duo on a minimalist pedestal with a moody gradient backdrop. Edge lighting highlights shapes, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Component_Close',
          title: 'PC component sculpture',
          description: 'Graphics card or component spotlighted on a pedestal.',
          prompt:
            'Produce a studio close-up of my hardware component—GPU, motherboard, or headset—spotlit against a dark neutral background. Controlled reflections, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Controller_Ring',
          title: 'Controller light ring',
          description: 'Game controller encircled by LED light trails.',
          prompt:
            'Create a studio hero image of my game controller centered within circular LED light trails captured with long exposure. Dark background, vibrant colors, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Dual_Monitor',
          title: 'Dual monitor command center',
          description: 'Two displays angled with keyboard and mouse.',
          prompt:
            'Photograph my dual monitor setup angled toward the camera with keyboard, mouse, and headset arranged neatly on a glossy desk. Subtle fog and RGB edge lighting for drama, no screen content.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Battlestation',
          title: 'Gaming corner',
          description: 'Gaming setup in a room with ambient lighting.',
          prompt:
            'Lifestyle scene of my gaming setup on a desk with monitor, keyboard, LED lights, and gaming chair. Ambient purple-blue glow, wallpaper softly blurred, no people, no text on screens.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_WorkspaceHybrid',
          title: 'Hybrid work/gaming desk',
          description: 'Peripherals with a laptop and notebooks in daylight.',
          prompt:
            'Show my computer equipment on a light wooden table pairing a laptop with peripherals, notebook, and plant. Natural light balances work and play vibes. No people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_CouchGaming',
          title: 'Casual living room gaming',
          description: 'Console and controllers on a coffee table in the living room.',
          prompt:
            'Capture my controller and handheld devices on a coffee table in front of a sofa with snacks and blankets. Warm evening light, TV background blurred, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_LAN_Party',
          title: 'LAN party setup',
          description: 'Multiple rigs set up around a table.',
          prompt:
            'Show my gaming laptops and peripherals arranged on a long table with cable management and LED lighting suggesting a LAN party. Ambient colored lights, no people visible.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Portable_Gaming',
          title: 'Handheld gaming in transit',
          description: 'Handheld console styled on train or plane seat.',
          prompt:
            'Photograph my handheld console resting on a travel tray with headphones and snacks, window view softly blurred. Natural daylight, no hands or passengers visible.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Keycap',
          title: 'Keycap detail',
          description: 'Macro of keys with visible texture and lighting.',
          prompt:
            'Macro detail of my mechanical keyboard keycaps highlighting legends and texture. Raking light, softly blurred background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Mouse_Scroll',
          title: 'Scroll wheel close-up',
          description: 'Close-up of the scroll wheel and side grips on a gaming mouse.',
          prompt:
            'Close-up of my gaming mouse scroll wheel and side grips showing material detail. Side lighting emphasizes texture against a neutral background. No text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Controller_Button',
          title: 'Controller button detail',
          description: 'Macro of controller buttons or triggers.',
          prompt:
            'Macro shot of my controller buttons or thumbsticks with crisp focus and soft lighting. Background blurred, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_RGB_Fan',
          title: 'RGB fan blades',
          description: 'Close-up of illuminated cooling fan blades.',
          prompt:
            'Capture a macro shot of my RGB PC fan blades glowing through the grille with motion blur frozen, emphasizing colors and textures. Dark background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Headset_Cushion',
          title: 'Headset cushion texture',
          description: 'Macro of ear cushion material and stitching.',
          prompt:
            'Photograph the ear cushion of my gaming headset showing stitching and memory foam texture with soft directional lighting. Background blurred, no text.',
        },
      ],
    },
  },
  home_appliances: {
    label: 'Home Appliances',
    subcategories: [
      { id: 'home_appliances_kitchen', label: 'Small Kitchen Appliances' },
      { id: 'home_appliances_cleaning', label: 'Cleaning Devices' },
      { id: 'home_appliances_homecare', label: 'Home Care Gadgets' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Countertop_Appliance',
          title: 'Small appliance hero',
          description: 'Blender, food processor, or vacuum on a clean background.',
          prompt:
            'Create a studio hero shot of my countertop appliance centered on a matte surface with a soft gradient background. Balanced key and fill lighting reveal form and controls. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Appliance_Parts',
          title: 'Accessory set',
          description: 'Main appliance styled with neatly arranged attachments.',
          prompt:
            'Photograph my appliance with its key attachments or accessories laid out neatly beside it on a neutral surface. Overhead soft light, clean shadows, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Cutaway_Glow',
          title: 'Dramatic cutaway glow',
          description: 'Appliance glowing from within for a tech-forward feel.',
          prompt:
            'Produce a studio image of my appliance with the interior softly illuminated to showcase features. Darkened environment with rim light outlining the silhouette. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Glass_Surface',
          title: 'Glass surface reflection',
          description: 'Appliance on a glossy surface with controlled reflections.',
          prompt:
            'Create a studio hero shot of my appliance placed on a glossy surface capturing a clean reflection with soft gradient backdrop and sculpted lighting. Keep highlights controlled and no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Ingredient_Surround',
          title: 'Ingredients surrounding hero',
          description: 'Appliance encircled by ingredients or tools.',
          prompt:
            'Photograph my appliance surrounded by neatly arranged ingredients or attachments on concentric trays with soft top lighting. Emphasize order and cleanliness, no people.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Kitchen_Action',
          title: 'Appliance in the kitchen',
          description: 'Appliance on a kitchen counter with fresh ingredients.',
          prompt:
            'Lifestyle scene of my appliance on a kitchen counter surrounded by fresh ingredients and utensils. Natural window light, modern kitchen background softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Cleaning_Closet',
          title: 'Vacuum in the living room',
          description: 'Vacuum staged in a tidy living room interior.',
          prompt:
            'Capture my cleaning appliance standing in a bright living area with rug and plants, styled as ready for use. Warm light, tidy background, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Breakfast_Scene',
          title: 'Breakfast blender moment',
          description: 'Blender preparing smoothies with fruit and glasses.',
          prompt:
            'Photograph my blender or breakfast appliance mid-prep with smoothies, glasses, and fresh fruit on the table. Sunlight, softly blurred background, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Dinner_Prep',
          title: 'Dinner prep countertop',
          description: 'Appliance in evening kitchen with ingredients.',
          prompt:
            'Capture my appliance on a kitchen island during dinner prep with chopping board, herbs, and warm pendant lighting. Motion blur minimal, focus on product, no people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Coffee_Bar',
          title: 'Coffee bar vignette',
          description: 'Appliance styled as part of a coffee station.',
          prompt:
            'Photograph my appliance on a coffee station with mugs, beans, and wall art in a cozy nook. Warm ambient lighting, background softly out of focus, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Control_Knob',
          title: 'Control panel close-up',
          description: 'Macro of buttons, knobs, or the appliance display.',
          prompt:
            'Close-up of my appliance control knob or digital interface with crisp focus on icons. Controlled lighting avoids glare, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Blade_Texture',
          title: 'Blades or filters',
          description: 'Close-up of blender blades or vacuum filters.',
          prompt:
            'Macro detail of my appliance blade or mixing component showing sharpness and material finish. Side lighting for texture, background softly blurred. No text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Material_Finish',
          title: 'Materials and textures',
          description: 'Detail of housing, handle, or rubberized sections.',
          prompt:
            'Capture the material finish of my appliance—brushed steel, matte plastic, or rubber grip—with soft lighting to highlight texture. Neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Filter',
          title: 'Filter or basket detail',
          description: 'Close-up of mesh filters or baskets.',
          prompt:
            'Photograph the removable filter or basket from my appliance at macro scale to showcase mesh detail and cleanliness. Side lighting, neutral background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Cord_Wrap',
          title: 'Cord storage close-up',
          description: 'Focus on cord wrap or plug details.',
          prompt:
            'Capture a close-up of my appliance power cord wrap or plug with emphasis on tidy storage solutions. Soft lighting and shallow depth of field, no text.',
        },
      ],
    },
  },
  furniture_decor: {
    label: 'Furniture & Decor',
    subcategories: [
      { id: 'furniture_decor_seating', label: 'Seating' },
      { id: 'furniture_decor_lighting', label: 'Lighting' },
      { id: 'furniture_decor_accents', label: 'Decor Accents' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Chair_Pedestal',
          title: 'Chair as sculpture',
          description: 'Hero presentation of a chair or armchair on a podium.',
          prompt:
            'Create a studio hero photograph of my furniture piece on a minimal pedestal or platform against a neutral backdrop. Soft directional lighting highlights silhouette and upholstery. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Lighting_Focus',
          title: 'Lamp with ambient glow',
          description: 'Lighting fixture shown with a warm glow effect.',
          prompt:
            'Produce a studio shot of my lamp or lighting product on a matte surface with the light turned on, casting warm glow on the background. Controlled ambient light, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Decor_Flatlay',
          title: 'Decorative set',
          description: 'Decor, vases, and sculptures on a monochromatic background.',
          prompt:
            'Generate a studio flatlay of my decor items—vases, books, accents—arranged on a monochrome surface with soft shadows. Balanced composition, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Textile_Drape',
          title: 'Textile draped furniture',
          description: 'Furniture styled with layered throws and cushions.',
          prompt:
            'Create a studio hero shot of my furniture piece styled with layered throws, cushions, and a soft spotlight against a seamless backdrop. Emphasize fabric texture and form, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Pedestal_Group',
          title: 'Pedestal decor grouping',
          description: 'Vases and sculptures arranged on varying pedestals.',
          prompt:
            'Photograph my decor objects arranged on pedestals of varying heights with a gradient background and directional lighting casting elegant shadows. Keep scene minimal, no people.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_LivingRoom',
          title: 'Styled living room',
          description: 'Furniture in a living space with natural light.',
          prompt:
            'Lifestyle scene featuring my furniture in a bright living room with wooden floors, plants, and textiles. Natural window light, softly blurred background, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Corner_Vignette',
          title: 'Decorative corner',
          description: 'Side table with lamp, books, and artful accents.',
          prompt:
            'Capture a styled corner vignette with my side table, chair, and decor near a window. Soft daylight, background gently blurred, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Table_Setting',
          title: 'Dining styling',
          description: 'Table styled with decor and ambient lighting.',
          prompt:
            'Photograph a dining table styled with my decor pieces—tablecloth, dinnerware, candles, flowers. Natural or ambient lighting with softly blurred background, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Bedroom_Nook',
          title: 'Bedroom reading nook',
          description: 'Accent chair and decor beside a bed with soft light.',
          prompt:
            'Capture my furniture arranged as a bedroom reading nook with accent chair, side table, lamp, and layered textiles. Warm diffused light, no people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Patio_Glow',
          title: 'Evening patio ambiance',
          description: 'Outdoor seating styled with lanterns and plants.',
          prompt:
            'Photograph my outdoor furniture set on a patio at twilight with string lights, lanterns, and lush plants. Background softly blurred, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Wood_Grain',
          title: 'Wood grain detail',
          description: 'Macro of wood, joinery, or upholstery.',
          prompt:
            'Macro close-up of my furniture wood grain or joinery showing craftsmanship. Side lighting reveals texture, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Lamp_Shade',
          title: 'Lamp detail',
          description: 'Close-up of the shade or metal lighting accents.',
          prompt:
            'Capture the lamp shade or lighting diffuser material with light glowing through to show texture. Controlled exposure, blurred background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Decor_Surface',
          title: 'Decor surface detail',
          description: 'Macro of ceramic, glass, or textile surfaces.',
          prompt:
            'Macro detail of my decor surface—ceramic glaze, metal finish, or textile weave—with soft lighting and shallow depth of field. No text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Seam_Close',
          title: 'Seam craftsmanship',
          description: 'Close-up of seams, piping, or upholstery buttons.',
          prompt:
            'Photograph the seam or button tufting on my upholstered furniture with side lighting to reveal craftsmanship and materials. Background softly blurred, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Surface_Inlay',
          title: 'Inlay or hardware detail',
          description: 'Macro of inlaid patterns or decorative hardware.',
          prompt:
            'Capture a macro shot of my furniture inlay or decorative hardware showing pattern intricacy with directional light. Neutral background, no text.',
        },
      ],
    },
  },
  home_living: {
    label: 'Home & Living',
    subcategories: [
      { id: 'home_living_bedding', label: 'Bedding' },
      { id: 'home_living_rugs', label: 'Rugs' },
      { id: 'home_living_kitchenware', label: 'Kitchenware' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Bedding_Stack',
          title: 'Layered linens',
          description: 'Bedding or towels neatly stacked together.',
          prompt:
            'Create a studio hero photo of my bedding set folded or rolled in a stacked arrangement on a neutral surface. Soft diffused lighting highlights fabric softness. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Rug_Section',
          title: 'Rug showcase',
          description: 'Hero frame of a rug with the pattern clearly displayed.',
          prompt:
            'Photograph a section of my rug draped or laid flat on a platform with subtle raking light to show pile depth. Neutral background, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Kitchenware_Set',
          title: 'Kitchenware set',
          description: 'Cookware and utensils displayed on a clean surface.',
          prompt:
            'Produce a studio composition of my kitchenware set—bowls, utensils, cutting boards—arranged on a stone tabletop with diffused light. Balanced layout, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Textile_Tiers',
          title: 'Tiered textile stacks',
          description: 'Linens stacked on pedestals with tonal backdrop.',
          prompt:
            'Arrange my bedding or towels on tiered pedestals against a tonal gradient backdrop with soft overhead lighting to highlight plush textures. Keep composition minimal, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Tabletop_Display',
          title: 'Tabletop vignette hero',
          description: 'Home goods arranged on a styled tabletop.',
          prompt:
            'Create a studio hero scene of my tabletop decor—candles, ceramics, linens—arranged with negative space on a clean surface under directional lighting. No people or typography.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Bedroom_Cozy',
          title: 'Cozy bedroom',
          description: 'Bedding styled in a softly lit bedroom.',
          prompt:
            'Lifestyle scene of my bedding styled on a bed in a sunlit bedroom with plants and books on the nightstand. Natural light, softly blurred background, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Kitchen_Prep',
          title: 'Kitchen in action',
          description: 'Kitchen tools arranged with fresh ingredients.',
          prompt:
            'Capture my kitchen accessories on a countertop with fresh ingredients and a wooden board mid-preparation. Natural light, softly blurred background, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Rug_Living',
          title: 'Rug in the living room',
          description: 'Rug and decor styling a living space.',
          prompt:
            'Photograph my rug anchoring a living room with sofa, coffee table, and decor. Warm lighting, background softly blurred, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Bath_Retreat',
          title: 'Bathroom retreat styling',
          description: 'Bath textiles and accessories around a tub.',
          prompt:
            'Capture my bath linens, robes, and accessories arranged around a soaking tub with candles, greenery, and soft daylight to suggest a spa retreat. No people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Dining_Brunch',
          title: 'Weekend brunch table',
          description: 'Tableware styled with pastries and flowers.',
          prompt:
            'Photograph my tableware on a dining table set for weekend brunch with pastries, fruit, and fresh flowers in a bright dining room. Background softly blurred, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Textile_Weave',
          title: 'Weave and fibers',
          description: 'Macro texture of bedding or rugs.',
          prompt:
            'Macro close-up of my textile weave showing fibers and stitching. Side lighting enhances texture, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Tableware_Finish',
          title: 'Tableware finish',
          description: 'Close-up of ceramics or flatware finish.',
          prompt:
            'Capture the finish of my tableware—ceramic glaze or polished metal—with soft lighting that highlights sheen. Background softly blurred, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Rug_Pile',
          title: 'Rug fibers',
          description: 'Macro of pile height and fiber structure.',
          prompt:
            'Macro detail of my rug pile showing fiber density and pattern. Raking light for depth, neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Linen_Hem',
          title: 'Hem stitching close-up',
          description: 'Close-up of hem stitching or edging.',
          prompt:
            'Capture a macro shot of my linen hem or edging highlighting stitching quality with soft side lighting. Background blurred, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Tableware_Glaze',
          title: 'Glaze texture macro',
          description: 'Macro of ceramic glaze or metallic finish.',
          prompt:
            'Photograph the glaze or metallic finish of my tableware with controlled reflections and shallow depth of field to showcase craftsmanship. Neutral background, no text.',
        },
      ],
    },
  },
  food_beverage: {
    label: 'Food & Beverage',
    subcategories: [
      { id: 'food_beverage_gourmet', label: 'Gourmet Treats' },
      { id: 'food_beverage_health', label: 'Health Foods' },
      { id: 'food_beverage_drinks', label: 'Coffee & Tea' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Gourmet_Platter',
          title: 'Gourmet hero platter',
          description: 'Luxury products arranged on a dark background.',
          prompt:
            'Create a studio hero image of my gourmet food products (chocolates, cheeses, oils) styled on a dark stone podium with controlled top lighting and accent highlights. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Packaging_Line',
          title: 'Product lineup',
          description: 'Food packaging arranged in a rhythmic row.',
          prompt:
            'Photograph my food packaging lineup arranged in a rhythmic row on a clean background. Soft side lighting brings out label design, gentle shadows for depth. No text beyond packaging.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Beverage_Pour',
          title: 'Beverage pour highlight',
          description: 'Bottle and glass with an emphasis on pouring.',
          prompt:
            'Produce a studio shot of my beverage being poured into glassware with motion frozen mid-pour. Sleek reflective surface, dramatic lighting, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Ingredient_Scatter',
          title: 'Ingredient scatter hero',
          description: 'Products surrounded by signature ingredients.',
          prompt:
            'Create a studio hero composition of my food products surrounded by their signature ingredients scattered artfully on a matte surface under directional top lighting. Clean gradients, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Pedestal_Display',
          title: 'Tiered packaging display',
          description: 'Packaging elevated on tiered podiums with spotlight.',
          prompt:
            'Arrange my packaged foods on tiered podiums with a focused spotlight and gentle rim light to emphasize premium finishes. Background minimal, no text overlays.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Breakfast_Table',
          title: 'Healthy breakfast',
          description: 'Food and drinks in a morning kitchen.',
          prompt:
            'Lifestyle scene of my food products on a breakfast table with bowls, fruit, smoothies, and coffee. Natural morning light, kitchen background softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_CoffeeMoment',
          title: 'Coffee ritual',
          description: 'Coffee or tea styled with complementary props.',
          prompt:
            'Capture my coffee or tea product in a ceramic cup on a table alongside a book and a flower. Warm morning light with steam visible, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_GiftHamper',
          title: 'Gift hamper',
          description: 'Gourmet products arranged in a gift basket.',
          prompt:
            'Photograph my gourmet items arranged in a gift basket on a wooden table with ribbon and natural decor. Daylight, softly blurred background, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Picnic_Spread',
          title: 'Picnic spread',
          description: 'Products styled on a picnic blanket outdoors.',
          prompt:
            'Capture my food and beverage products arranged on a picnic blanket with wicker baskets, fruit, and glassware in a park setting. Natural daylight, background softly blurred, no people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Kitchen_Prep',
          title: 'Kitchen prep moment',
          description: 'Ingredients mid-preparation on a countertop.',
          prompt:
            'Photograph my gourmet ingredients mid-preparation on a kitchen counter with chopping board, herbs, and utensils in frame. Natural window light, no hands or people visible.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Texture_Food',
          title: 'Food texture detail',
          description: 'Macro look at textures like chocolate or coffee beans.',
          prompt:
            'Macro detail of my food texture—drizzled sauce, chocolate surface, or grain mix—with side lighting to highlight sheen. Neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Label_Bottle',
          title: 'Bottle label close-up',
          description: 'Close-up of a beverage label emphasizing typography.',
          prompt:
            'Close-up of my bottle or jar label showing typography and foil elements with controlled reflections. Soft light, blurred background, no text overlays.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Pour_Splash',
          title: 'Dynamic pour',
          description: 'Macro moment of pouring or dripping.',
          prompt:
            'Capture a close-up of my beverage or syrup splashing into a glass with crisp droplets frozen. Dark background, edge lighting, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Sliced_Texture',
          title: 'Sliced texture',
          description: 'Macro of sliced product showing interior.',
          prompt:
            'Capture a macro detail of my sliced food product showing interior texture and moisture with raking light. Neutral background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Label_Emboss',
          title: 'Embossed label highlight',
          description: 'Close-up of foil or embossed label elements.',
          prompt:
            'Photograph a close-up of my packaging label highlighting foil or embossed details with angled light to reveal shine. Background softly blurred, no text.',
        },
      ],
    },
  },
  kids_products: {
    label: 'Kids & Baby Products',
    subcategories: [
      { id: 'kids_products_apparel', label: 'Apparel' },
      { id: 'kids_products_toys', label: 'Toys' },
      { id: 'kids_products_strollers', label: 'Strollers & Gear' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Apparel_Set',
          title: 'Kids outfit',
          description: "Children's apparel displayed on a hanging setup with toys.",
          prompt:
            'Create a studio hero image of my children\'s apparel set neatly arranged on a neutral backdrop with coordinating props. Soft diffused light emphasizes fabric softness. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Stroller_Spotlight',
          title: 'Stroller spotlight',
          description: 'Stroller on a pedestal with controlled lighting.',
          prompt:
            'Photograph my stroller or baby gear centered on a matte floor with a gentle spotlight and gradient background. Highlight stitching and details, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Toy_Set',
          title: 'Toy set',
          description: 'Toys arranged in a playful composition.',
          prompt:
            'Produce a studio shot of my children\'s toy collection arranged playfully on a colorful yet clean surface with balanced lighting. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Pastel_Pedestals',
          title: 'Pastel pedestal lineup',
          description: 'Kids products styled on pastel podiums.',
          prompt:
            'Arrange my kids products on pastel-colored podiums against a seamless background with gentle top lighting to highlight friendly shapes. Keep the scene whimsical, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Suspended_Play',
          title: 'Floating play moment',
          description: 'Lightweight toys appearing to float in motion.',
          prompt:
            'Create a studio hero shot where my lightweight toys appear to float through the air using hidden supports, captured with bright playful lighting on a clean backdrop. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Nursery',
          title: 'Nursery room',
          description: "Children's products styled in a curated nursery.",
          prompt:
            'Lifestyle scene of my children\'s products in a bright nursery with pastel walls, decor, and natural light. Focus on products, no children, no text.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Playtime',
          title: 'Playtime setup',
          description: 'Toys arranged on a soft rug.',
          prompt:
            'Capture my toys spread across a soft rug with pillows and shelves in the background. Warm daylight, no children, no text.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Stroller_Walk',
          title: 'Stroller ready for a walk',
          description: 'Stroller by the doorway with essentials for heading out.',
          prompt:
            'Photograph my stroller next to the entryway with diaper bag, blanket, and plants. Natural light, softly blurred background, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Playroom_Shelves',
          title: 'Playroom shelf styling',
          description: 'Toys organized on shelves in a bright playroom.',
          prompt:
            'Capture my toys and books styled on open shelving in a bright playroom with rugs and wall art for context. Soft daylight, no children present.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Diaper_Station',
          title: 'Changing station vignette',
          description: 'Changing table styled with baby essentials.',
          prompt:
            'Photograph my baby care essentials organized on a changing table with baskets, wipes, and a plush toy in a softly lit nursery corner. No people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Fabric_Soft',
          title: 'Soft fabric detail',
          description: "Macro of plush children's fabric or knit.",
          prompt:
            'Macro close-up of my children\'s fabric showing plush texture and stitching. Soft lighting, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Safety_Buckle',
          title: 'Safety detail',
          description: 'Close-up of a buckle or safety harness.',
          prompt:
            'Capture the safety buckle or clasp on my stroller/car seat with sharp focus on mechanism. Soft light, blurred background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Toy_Texture',
          title: 'Toy texture',
          description: 'Macro detail of toy materials.',
          prompt:
            'Macro detail of my toy surface—wood grain, plush fibers, or plastic molding—with directional light highlighting texture. No text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Snap_Closure',
          title: 'Snap closure detail',
          description: 'Close-up of snaps, buttons, or zippers.',
          prompt:
            'Capture a macro detail of my baby apparel snap or zipper with soft lighting to emphasize safety features and finish. Neutral background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Teether_Texture',
          title: 'Teether texture macro',
          description: 'Macro of teether or sensory toy surfaces.',
          prompt:
            'Photograph the surface texture of my teether or sensory toy at macro scale with side lighting to highlight ridges and patterns. Background softly blurred, no text.',
        },
      ],
    },
  },
  toys_hobbies: {
    label: 'Toys & Hobbies',
    subcategories: [
      { id: 'toys_hobbies_building_sets', label: 'Building Sets' },
      { id: 'toys_hobbies_board_games', label: 'Board Games' },
      { id: 'toys_hobbies_modeling', label: 'Model Kits' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Brick_Scene',
          title: 'LEGO hero scene',
          description: 'Building sets or models in a dynamic arrangement.',
          prompt:
            'Create a studio hero photo of my building bricks assembled into a small scene on a matte surface with playful colored lighting. Clean background, no text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_BoardGame_Display',
          title: 'Board game showcase',
          description: 'Board game with an open box and neatly arranged components.',
          prompt:
            'Photograph my board game box and components styled on a tabletop with balanced overhead lighting. Pieces arranged neatly, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Modelcraft',
          title: 'Model crafting in progress',
          description: 'Model kit presented mid-build.',
          prompt:
            'Produce a studio shot of my model or hobby kit on a pedestal with tools arranged beside it. Neutral background, spotlight accent, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Game_Tower',
          title: 'Stacked game tower',
          description: 'Board and card games stacked on geometric blocks.',
          prompt:
            'Arrange my board and card games in a stacked tower on geometric blocks against a dark gradient backdrop with colorful rim lighting. Keep layout precise, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Diorama_Spotlight',
          title: 'Diorama spotlight hero',
          description: 'Miniature scene highlighted by dramatic lighting.',
          prompt:
            'Create a studio hero image of my miniature diorama or model vehicle illuminated by a tight spotlight with subtle atmosphere for depth. Clean background, no text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_GameNight',
          title: 'Game night setup',
          description: 'Board game on the table ready to play.',
          prompt:
            'Lifestyle scene of my board game set up on a wooden table with snacks and drinks ready for game night. Warm evening light, background softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_HobbyDesk',
          title: 'Hobby workstation',
          description: 'Model-making tools and parts spread across the desk.',
          prompt:
            'Photograph my hobby workspace with paints, brushes, and sketches laid out under a task lamp. Crisp lighting, softly blurred background, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Playroom',
          title: 'Playroom',
          description: 'Toys organized on a rug inside a playroom.',
          prompt:
            'Capture my toys organized in a playroom with shelves, cushions, and wall art. Natural light, focus on products, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Game_Table',
          title: 'Game table evening',
          description: 'Board game set up with snacks and mood lighting.',
          prompt:
            'Photograph my board game spread across a dining table with bowls of snacks, drinks, and warm evening lighting to suggest gameplay. No players visible.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Shelf_Display',
          title: 'Collector shelf vignette',
          description: 'Collectibles styled on illuminated shelves.',
          prompt:
            'Capture my collectible figures or models arranged on illuminated shelving with accent lights and tidy props in the background. No people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Brick_Close',
          title: 'Brick detail',
          description: 'Macro of interlocking blocks or pieces.',
          prompt:
            'Macro detail of my building bricks clicked together to show studs and texture. Side lighting, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Card_Texture',
          title: 'Cards or tokens',
          description: 'Close-up of card or token components.',
          prompt:
            'Close-up of my playing cards or board game pieces highlighting print and paper texture. Soft light, blurred background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Paint_Brush',
          title: 'Model brush detail',
          description: 'Macro view of hobby brushes or tools.',
          prompt:
            'Macro shot of my paintbrush tips or model tool with pigment on the bristles. Controlled lighting, neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Dice_Close',
          title: 'Dice texture macro',
          description: 'Close-up of dice or specialty game pieces.',
          prompt:
            'Capture a macro detail of my dice or specialty game pieces showing engraved numbers and material texture with dramatic side lighting. Neutral backdrop, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Model_Surface',
          title: 'Model surface texture',
          description: 'Macro of painted surfaces or decals.',
          prompt:
            'Photograph the painted surface or decals on my model kit at macro scale to highlight craftsmanship and weathering with shallow depth of field. No text.',
        },
      ],
    },
  },
  automotive: {
    label: 'Automotive Gear',
    subcategories: [
      { id: 'automotive_tires', label: 'Tires & Wheels' },
      { id: 'automotive_fluids', label: 'Fluids & Maintenance' },
      { id: 'automotive_accessories', label: 'Interior Accessories' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Tire_Profile',
          title: 'Tire hero shot',
          description: 'Automotive tire on a pedestal with dramatic lighting.',
          prompt:
            'Create a studio hero image of my tire or wheel product standing upright on a glossy floor with a dark gradient background. Rim lighting accentuates tread pattern. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Care_Kit',
          title: 'Detailing set',
          description: 'Car care kit on a clean background.',
          prompt:
            'Photograph my automotive care kit—cleaners, microfiber, applicators—arranged neatly on a reflective surface with controlled highlights. No text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Oil_Bottle',
          title: 'Motor oil spotlight',
          description: 'Engine oil bottle on a reflective base.',
          prompt:
            'Produce a studio shot of my oil or fluid bottle on a pedestal with dramatic lighting from behind to emphasize transparency. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Wheel_Reflection',
          title: 'Wheel on reflective floor',
          description: 'Wheel showcased on glossy floor with rim light.',
          prompt:
            'Create a studio hero image of my wheel placed on a glossy black floor capturing a clean reflection with rim lighting accentuating spokes. Subtle haze for drama, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Detailing_Array',
          title: 'Detailing array hero',
          description: 'Detailing tools arranged around a centerpiece.',
          prompt:
            'Arrange my detailing tools, polishes, and applicators in a semicircle around the hero product on a matte surface with gradient background and directional light. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Garage',
          title: 'Garage setup',
          description: 'Automotive equipment staged in a garage.',
          prompt:
            'Lifestyle scene of my automotive products displayed in a clean garage with a vehicle in the background. Natural light from the open door, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Trunk_Organized',
          title: 'Organized trunk',
          description: 'Gear arranged neatly inside a vehicle trunk.',
          prompt:
            'Capture my gear neatly arranged in a car trunk with cargo liner and lighting. Vehicle interior softly blurred, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Car_Wash',
          title: 'Detailing in action',
          description: 'Products staged beside a car during a wash.',
          prompt:
            'Photograph my detailing kit beside a car during a wash with sunlit water droplets. Warm light, background softly blurred, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Detail_Garage',
          title: 'Garage detail station',
          description: 'Products arranged on a cart in a garage bay.',
          prompt:
            'Capture my automotive care products organized on a rolling cart inside a well-lit garage bay with a vehicle in soft focus. No people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Trunk_Prep',
          title: 'Trunk prep vignette',
          description: 'Travel gear staged on the open tailgate.',
          prompt:
            'Photograph my automotive travel accessories arranged on an open tailgate overlooking a scenic road. Natural golden-hour light, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Tread_Close',
          title: 'Tread pattern detail',
          description: 'Macro of the tire tread pattern.',
          prompt:
            'Macro detail of my tire tread showing grooves and texture with side lighting. Dark background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Microfiber',
          title: 'Microfiber and spray',
          description: 'Close-up of microfiber with product droplets.',
          prompt:
            'Close-up of my microfiber cloth or applicator highlighting fibers and edge stitching. Soft light, neutral background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Oil_Pour',
          title: 'Oil pour detail',
          description: 'Macro moment of oil pouring.',
          prompt:
            'Capture a close-up of my oil or fluid pouring into a funnel with crisp droplet detail. Controlled lighting, blurred background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Tread_Profile',
          title: 'Tread profile macro',
          description: 'Macro of tread blocks and siping.',
          prompt:
            'Capture a macro detail of my tire tread showing blocks and siping with angled light to emphasize depth and texture. Dark background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Polish_Bead',
          title: 'Polish beading detail',
          description: 'Macro of water or polish beading on paint.',
          prompt:
            'Photograph beads of water or ceramic coating on a glossy painted panel to highlight hydrophobic effect with sharp highlights. Neutral backdrop, no text.',
        },
      ],
    },
  },
  pet_products: {
    label: 'Pet Products',
    subcategories: [
      { id: 'pet_products_food', label: 'Food' },
      { id: 'pet_products_gear', label: 'Gear & Care' },
      { id: 'pet_products_toys', label: 'Toys' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Pet_Food',
          title: 'Pet food showcase',
          description: 'Pet food bag and bowls in a studio setting.',
          prompt:
            'Create a studio hero photograph of my pet food packaging and bowls on a neutral pedestal with soft light from the side. Controlled reflections, no text beyond packaging.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Pet_Toy_Set',
          title: 'Toy assortment',
          description: 'Pet toys and accessories staged on a pedestal.',
          prompt:
            'Produce a studio shot of my pet toys arranged playfully on a colorful yet clean surface with diffused lighting. No text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Pet_Bed',
          title: 'Pet bed spotlight',
          description: 'Pet bed highlighted with textile detailing.',
          prompt:
            'Photograph my pet bed fluffed on a platform with layered blankets to show texture. Soft lighting from two sides, neutral background, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Treat_Jars',
          title: 'Treat jar lineup',
          description: 'Pet treats in glass jars with playful props.',
          prompt:
            'Arrange my pet treats in glass jars with scoops and playful props on a pastel backdrop lit with soft top light to highlight textures. No animals or text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Grooming_Set',
          title: 'Grooming essentials hero',
          description: 'Brushes and grooming tools arranged on a clean surface.',
          prompt:
            'Create a studio hero image of my pet grooming tools arranged neatly on a neutral surface with gentle rim lighting and minimal shadows. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Kitchen_Feeding',
          title: 'Feeding corner',
          description: 'Food and bowls styled in the kitchen.',
          prompt:
            'Lifestyle scene of my pet feeding setup in the kitchen with bowls on the floor and accessories neatly arranged. Natural light, softly blurred background, no animals.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_LivingRoom_Toys',
          title: 'Toys in the living room',
          description: 'Toys and blankets arranged beside the sofa.',
          prompt:
            'Capture my pet toys and accessories styled in a living room beside the sofa and plants. Warm light, background soft, no animals.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Entry_Leash',
          title: 'Walk essentials ready',
          description: 'Leashes and accessories by the front door.',
          prompt:
            'Photograph leashes, harnesses, and treat bags hanging near the entryway with bench and decor. Natural light, blurred background, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Patio_Pet',
          title: 'Outdoor relaxation setup',
          description: 'Pet bed and bowls styled on a patio with plants.',
          prompt:
            'Capture my pet bed, bowls, and toys styled on an outdoor patio with greenery and string lights to suggest relaxation. Natural daylight, no animals.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Pantry_Storage',
          title: 'Organized pet pantry',
          description: 'Pet food storage arranged on shelves.',
          prompt:
            'Photograph my pet food containers and accessories arranged on pantry shelves with labels and scoops for an organized look. Bright even lighting, no animals.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Kibble_Close',
          title: 'Food texture',
          description: 'Macro of kibble or treats.',
          prompt:
            'Macro detail of my pet food kibble or treats piled on a surface showing shape and texture. Side lighting, neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Leash_Clip',
          title: 'Leash clip detail',
          description: 'Close-up of metal clasp and strap.',
          prompt:
            'Close-up of my leash hardware focusing on clasp mechanism and stitching. Controlled lighting, blurred background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Bed_Stitch',
          title: 'Bed stitching detail',
          description: 'Macro of bed stitching and filling.',
          prompt:
            'Macro shot of my pet bed stitching or faux fur material with soft lighting to emphasize plushness. Neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Treat_Texture',
          title: 'Treat texture macro',
          description: 'Close-up of treat surface showing flavor inclusions.',
          prompt:
            'Capture a macro view of my pet treat showing texture and ingredients with side lighting and shallow depth of field. Neutral background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Collar_Hardware',
          title: 'Collar hardware detail',
          description: 'Macro of collar buckle and stitching.',
          prompt:
            'Photograph the buckle and stitching on my pet collar at macro scale with controlled highlights to showcase craftsmanship. Background softly blurred, no text.',
        },
      ],
    },
  },
  diy_tools: {
    label: 'DIY & Tools',
    subcategories: [
      { id: 'diy_tools_hand', label: 'Hand Tools' },
      { id: 'diy_tools_repair', label: 'Repair Kits' },
      { id: 'diy_tools_materials', label: 'Materials' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Tool_Set',
          title: 'Tool set',
          description: 'Hand tools and accessories arranged neatly.',
          prompt:
            'Create a studio hero shot of my tool set laid out on a dark work surface with directional light from above to cast crisp shadows. No text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_PowerTool',
          title: 'Power tool spotlight',
          description: 'Power tool presented on a pedestal.',
          prompt:
            'Photograph my power tool standing upright with attachments nearby on a neutral background. Accent lighting highlights contours, no text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Materials_Stack',
          title: 'Materials and supplies',
          description: 'Materials and consumables arranged in composition.',
          prompt:
            'Produce a studio image of my materials—wood, metal, fasteners—stacked or layered neatly with controlled side lighting. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_CuttingMat_Flatlay',
          title: 'Cutting mat flat lay',
          description: 'Tools arranged on a cutting mat with grid lines.',
          prompt:
            'Arrange my hand tools on a self-healing cutting mat with grid lines, hardware, and pencils aligned precisely. Top-down lighting keeps shadows crisp. No text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Pegboard_Lighting',
          title: 'Pegboard spotlight',
          description: 'Tools hanging on a lit pegboard wall.',
          prompt:
            'Create a studio hero shot of my tools hanging on a pegboard wall with dramatic edge lighting and a dark vignette to emphasize form. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Workbench',
          title: 'Garage workbench',
          description: 'Tools arranged across a workbench.',
          prompt:
            'Lifestyle scene of my tools on a workbench with pegboard, wooden wall, and natural window light. Focus on products, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_DiyProject',
          title: 'Project in progress',
          description: 'Materials and plans spread across the table.',
          prompt:
            'Capture my DIY project in progress with plans, materials, and tools spread across the table. Warm workshop light, background softly blurred, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_ToolBag',
          title: 'Tool bag ready',
          description: 'Portable bag and tools ready to go.',
          prompt:
            'Photograph my tool bag open on the floor with gloves and helmet beside it. Natural light, neutral background, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Renovation_Setup',
          title: 'Renovation staging',
          description: 'Tools arranged in a partially renovated room.',
          prompt:
            'Capture my tools organized on a drop cloth inside a partially renovated room with ladder, paint cans, and sunlight streaming through windows. No people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Truck_Organized',
          title: 'Organized truck bed',
          description: 'Toolboxes lined up in a truck bed at the job site.',
          prompt:
            'Photograph my toolboxes and cases lined up in a truck bed with jobsite scenery softly blurred behind. Natural daylight, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Blade_Edge',
          title: 'Blade in focus',
          description: 'Macro of blades, drill bits, or saw teeth.',
          prompt:
            'Macro detail of my blade edge or drill bit showing sharpness and metal finish. Side lighting for contrast, dark background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Handle_Grip',
          title: 'Handle grip detail',
          description: 'Close-up of rubberized or textured handles.',
          prompt:
            'Close-up of my tool handle grip material highlighting texture and ergonomics. Soft lighting, neutral background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Fastener_Assortment',
          title: 'Fasteners assortment',
          description: 'Macro of packaged screws, bolts, or nuts.',
          prompt:
            'Macro shot of my fastener assortment—screws, bolts, anchors—arranged by size with raking light. Neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Sawtooth',
          title: 'Saw tooth macro',
          description: 'Macro of saw blade teeth with sharp focus.',
          prompt:
            'Capture a macro close-up of my saw blade teeth catching light to emphasize sharpness and precision. Dark gradient background, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Handle_Texture',
          title: 'Handle texture detail',
          description: 'Close-up of rubberized tool handle texture.',
          prompt:
            'Photograph the textured grip of my tool highlighting pattern and ergonomics with side lighting and shallow depth of field. Neutral background, no text.',
        },
      ],
    },
  },
  books_education: {
    label: 'Books & Education',
    subcategories: [
      { id: 'books_education_print', label: 'Books' },
      { id: 'books_education_ebooks', label: 'E-books' },
      { id: 'books_education_courses', label: 'Online Courses' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Book_Stack',
          title: 'Stacked books',
          description: 'Collection of books or e-books arranged neatly.',
          prompt:
            'Create a studio hero shot of my books stacked with a slight fan or stagger on a neutral surface. Soft side lighting highlights spines and foil details. No text beyond covers.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Open_Book',
          title: 'Open book',
          description: 'Open book with highlighted pages.',
          prompt:
            'Photograph an open book with visible pages and markers alongside a tablet or e-reader on a matte surface. Soft diffused light, neutral background, no additional text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Course_Kit',
          title: 'Online course kit',
          description: 'Course materials and tech accessories.',
          prompt:
            'Produce a studio composition of my educational kit—books, worksheets, devices—arranged neatly with top-down lighting. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Color_Stack',
          title: 'Color-blocked study stack',
          description: 'Books and supplies grouped by color tones.',
          prompt:
            'Arrange my books and study accessories in color-blocked stacks on a neutral surface with soft overhead lighting and crisp shadows. No additional text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Open_Spreads',
          title: 'Open spreads showcase',
          description: 'Multiple books open with stationery props.',
          prompt:
            'Create a studio scene with multiple books fanned open alongside stationery, glasses, and a tablet on a matte tabletop. Balanced lighting, no text overlays.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_ReadingNook',
          title: 'Reading nook',
          description: 'Books and blankets in a cozy corner.',
          prompt:
            'Lifestyle scene of my books in a reading nook with armchair, blanket, and floor lamp. Warm evening light, background softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_WorkshopDesk',
          title: 'Online learning',
          description: 'Laptop, notes, and books on a desk.',
          prompt:
            'Capture my learning materials spread on a desk with laptop, notebooks, and mug. Natural light, focus on materials, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_StudyFlatlay',
          title: 'Study flatlay',
          description: 'Notes and books arranged in a flat lay.',
          prompt:
            'Create a flatlay of my educational resources—books, notes, markers, glasses—on a light surface with diffused light. No text.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Reading_Window',
          title: 'Window reading nook',
          description: 'Books stacked on a window seat with textiles.',
          prompt:
            'Capture my books stacked on a window seat with cushions, blanket, and mug to suggest a peaceful reading moment. Soft daylight, no people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Classroom_Supplies',
          title: 'Classroom supplies table',
          description: 'Educational materials arranged on classroom desk.',
          prompt:
            'Photograph my classroom supplies spread across a desk with chalkboard and posters softly blurred in the background. Even daylight, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Book_Spine',
          title: 'Book spine',
          description: 'Close-up of the spine or embossed print.',
          prompt:
            'Macro close-up of my book spine showing texture, embossing, and typography. Side lighting, neutral background, no text overlays.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Page_Texture',
          title: 'Paper and print',
          description: 'Macro of pages or illustrations.',
          prompt:
            'Capture page edges or paper texture with shallow depth of field and soft light. No text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Device_Interface',
          title: 'E-learning screen',
          description: 'Close-up of an interface on a tablet or laptop.',
          prompt:
            'Close-up of my course interface on a tablet or laptop showing clean UI elements. Controlled lighting to avoid glare, background blurred, no extra text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Spine_Foil',
          title: 'Foil spine macro',
          description: 'Macro of foil or embossed book spine.',
          prompt:
            'Capture a macro detail of my book spine with foil stamping or embossing using angled light to highlight texture. Background softly blurred, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Paper_Edge',
          title: 'Deckled edge detail',
          description: 'Macro of page edges or deckled paper.',
          prompt:
            'Photograph the edge of my book pages or deckled paper with shallow depth of field to emphasize texture. Soft lighting, no text.',
        },
      ],
    },
  },
  music_instruments: {
    label: 'Music & Instruments',
    subcategories: [
      { id: 'music_instruments_guitars', label: 'Guitars' },
      { id: 'music_instruments_dj', label: 'DJ Equipment' },
      { id: 'music_instruments_vinyl', label: 'Vinyl Records' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Guitar_Stand',
          title: 'Guitar spotlight',
          description: 'Instrument on a stand with dramatic lighting.',
          prompt:
            'Create a studio hero shot of my instrument (guitar, violin) on a minimalist stand against a dark gradient backdrop. Spotlight from above highlights curves, no text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_DJ_Gear',
          title: 'DJ equipment',
          description: 'DJ controller or turntable styled in the studio.',
          prompt:
            'Produce a studio image of my DJ controller and headphones on a reflective surface with vibrant accent lighting. No text on displays.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Vinyl_Stack',
          title: 'Vinyl collection',
          description: 'Vinyl records and sleeves on a clean background.',
          prompt:
            'Photograph my vinyl stack or music collection arranged with a turntable on a matte surface. Soft side lighting, no text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Stage_Beams',
          title: 'Stage beam spotlight',
          description: 'Instrument lit by colorful stage beams.',
          prompt:
            'Create a studio hero shot of my instrument illuminated by intersecting colored stage beams with a hint of haze for drama. Dark background, no text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Pedalboard_Display',
          title: 'Pedalboard display',
          description: 'Pedalboard and cables organized on a reflective surface.',
          prompt:
            'Arrange my pedalboard, cables, and accessories on a reflective stage floor with gradient lighting to emphasize hardware details. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_StudioCorner',
          title: 'Music corner',
          description: 'Instrument in a room with supporting gear.',
          prompt:
            'Lifestyle scene of my instrument in a home studio with amplifier, cables, and posters. Warm ambient light, background softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_LivingRoom_Session',
          title: 'At-home session',
          description: 'Instrument on a couch with sheet music.',
          prompt:
            'Capture my instrument resting on a couch with sheet music and a warm beverage nearby. Natural daylight, relaxed mood, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_DJ_Setup',
          title: 'DJ setup',
          description: 'DJ equipment highlighted by ambient lighting.',
          prompt:
            'Photograph my DJ equipment set up on a table with ambient colored lights and vinyl records. Focus on gear, background softly blurred, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Stage_Warmup',
          title: 'Stage warmup',
          description: 'Instrument case open on stage with lights.',
          prompt:
            'Capture my instrument resting on stage with its case open, mic stand nearby, and stage lights glowing in the background to suggest pre-show energy. No performers.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Lounge_Session',
          title: 'Lounge jam setup',
          description: 'Gear arranged in a lounge for casual playing.',
          prompt:
            'Photograph my instrument, amp, and records arranged in a lounge with warm lamps and plants to imply a jam session. No people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_String_Close',
          title: 'Strings and frets',
          description: 'Macro detail of a guitar or string instrument.',
          prompt:
            'Macro detail of my string instrument focusing on strings, bridge, or fretboard with side lighting. Neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Knob_Fader',
          title: 'Controls and knobs',
          description: 'Close-up of knobs or faders.',
          prompt:
            'Close-up of the potentiometer or fader on my audio equipment highlighting metal and markings. Controlled light, blurred background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Vinyl_Groove',
          title: 'Vinyl groove',
          description: 'Macro of vinyl grooves or the stylus tip.',
          prompt:
            'Macro shot of my vinyl record grooves with light grazing across the surface. Background dark, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_String_Windings',
          title: 'String winding detail',
          description: 'Macro of guitar or violin string windings.',
          prompt:
            'Capture a macro close-up of my instrument strings around the tuning peg or bridge showing windings and patina with side lighting. No text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Knob_Indicator',
          title: 'Knob indicator macro',
          description: 'Close-up of amplifier or mixer knob indicator.',
          prompt:
            'Photograph the indicator mark on my amplifier or mixer knob with dramatic lighting to reveal engraving and finish. Dark blurred background, no text.',
        },
      ],
    },
  },
  outdoor_travel: {
    label: 'Outdoor & Travel',
    subcategories: [
      { id: 'outdoor_travel_camping', label: 'Camping Gear' },
      { id: 'outdoor_travel_backpacks', label: 'Backpacks' },
      { id: 'outdoor_travel_accessories', label: 'Travel Accessories' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Backpack_Hero',
          title: 'Backpack hero',
          description: 'Outdoor backpack on a pedestal with dramatic lighting.',
          prompt:
            'Create a studio hero shot of my outdoor backpack standing upright on a textured platform with a dark gradient backdrop. Rim light highlights contours, no text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Tent_Display',
          title: 'Tent showcase',
          description: 'Tent or camping gear presented in the studio.',
          prompt:
            'Produce a studio image of my tent or shelter partially pitched on a clean surface with directional lighting to show structure. No text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Gear_Flatlay',
          title: 'Outdoor flat lay',
          description: 'Camping gear arranged in a top-down composition.',
          prompt:
            'Generate a top-down flatlay of my outdoor gear—maps, compass, cookware, jacket—arranged on a wooden or stone background with diffused light. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Rope_Suspension',
          title: 'Suspended gear hero',
          description: 'Gear pieces suspended by climbing rope.',
          prompt:
            'Create a studio hero shot of my outdoor gear pieces suspended from climbing rope against a dark backdrop with directional lighting to highlight rugged textures. No text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Terrain_Podium',
          title: 'Terrain-inspired podium',
          description: 'Gear staged on textured rocks or faux terrain.',
          prompt:
            'Arrange my outdoor gear on faux rock terrain or textured pedestals with misty backlighting to evoke alpine adventure. Keep composition clean, no text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Campsite',
          title: 'Campsite scene',
          description: 'Tent and gear on location at sunset.',
          prompt:
            'Lifestyle scene of my tent and gear set up at a campsite during sunset. Warm light, landscape softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Trailhead',
          title: 'Backpack on the trail',
          description: 'Backpack leaning against a rock with a view.',
          prompt:
            'Capture my backpack and trekking poles leaning on a rock overlooking a panoramic view. Natural light, background softly blurred, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Packing',
          title: 'Packing for the trip',
          description: 'Gear laid out on the floor before departure.',
          prompt:
            'Photograph my outdoor equipment laid out on the floor next to an open suitcase ready for packing. Natural light, interior background softly blurred, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Trailhead_Panorama',
          title: 'Trailhead staging',
          description: 'Gear staged at trailhead with landscape view.',
          prompt:
            'Capture my gear arranged at a trailhead or overlook with mountains in the background during golden hour to suggest adventure. No people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Campsite_Table',
          title: 'Camp table spread',
          description: 'Cookware and food on campsite table.',
          prompt:
            'Photograph my outdoor cookware and food arranged on a campsite picnic table with lantern light and tent in soft focus. No people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Fabric_Weatherproof',
          title: 'Waterproof material',
          description: 'Macro of coated fabrics or sealed seams.',
          prompt:
            'Macro detail of my technical fabric showing waterproof coating or ripstop weave with side lighting. Neutral background, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Buckle_System',
          title: 'Buckle system',
          description: 'Close-up of buckles and straps on the gear.',
          prompt:
            'Close-up of my backpack buckle or strap system highlighting hardware and stitching. Controlled light, blurred background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Tent_Pole',
          title: 'Pole joint detail',
          description: 'Macro of tent pole connections or carabiners.',
          prompt:
            'Macro photograph of the joint on my tent pole or carabiner clip showcasing metal finish. Side lighting, neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Fabric_Coating',
          title: 'Weatherproof coating',
          description: 'Close-up of waterproof fabric beading water.',
          prompt:
            'Capture a macro detail of my weatherproof fabric with water beading on the surface to highlight protective coating. Controlled lighting, no text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Rope_Braid',
          title: 'Rope braid macro',
          description: 'Macro of climbing rope or strap weave.',
          prompt:
            'Photograph the braided structure of my climbing rope or strap with shallow depth of field and side lighting to emphasize fibers. Neutral background, no text.',
        },
      ],
    },
  },
  seasonal_products: {
    label: 'Seasonal Products',
    subcategories: [
      { id: 'seasonal_products_holiday', label: 'Holiday Decor' },
      { id: 'seasonal_products_halloween', label: 'Halloween Costumes' },
      { id: 'seasonal_products_summer', label: 'Summer Essentials' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Holiday_Display',
          title: 'Holiday hero',
          description: 'Seasonal decor on a podium with themed lighting.',
          prompt:
            'Create a studio hero scene of my seasonal decorations arranged on a tiered podium with festive lighting and subtle props. Background in complementary holiday colors, no text.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Costume_Mannequin',
          title: 'Costume on mannequin',
          description: 'Seasonal costume presented on a mannequin.',
          prompt:
            'Produce a studio shot of my seasonal costume displayed on a mannequin against a neutral backdrop with dramatic spot lighting. No text.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Summer_Set',
          title: 'Summer set',
          description: 'Summer products styled in the studio.',
          prompt:
            'Photograph my summer product set—sunscreen, hat, sunglasses—on sand or a warm-toned surface with bright directional light. No text.',
        },
        {
          idSuffix: '10',
          name: 'Studio_Winter_Wonderland',
          title: 'Winter wonderland hero',
          description: 'Snow-dusted holiday products with cool lighting.',
          prompt:
            'Create a studio hero scene of my winter seasonal products on frosted acrylic blocks with cool blue lighting and subtle falling snow effect. No text.',
        },
        {
          idSuffix: '11',
          name: 'Studio_Seasonal_Flatlay',
          title: 'Seasonal flat lay',
          description: 'Seasonal assortment arranged in a flat lay.',
          prompt:
            'Arrange my seasonal assortment—ornaments, candles, gift tags—in a top-down flat lay on a textured surface with coordinated props and soft overhead light. No text.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '04',
          name: 'Lifestyle_Holiday_Table',
          title: 'Holiday table',
          description: 'Decor styled on a festive dining table.',
          prompt:
            'Lifestyle scene of my holiday decor styled on a dining table with candles and greenery. Warm ambient light, background softly blurred, no people.',
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_Halloween_Display',
          title: 'Halloween corner',
          description: 'Costumes and decor arranged in a themed vignette.',
          prompt:
            'Capture my Halloween products arranged in a moody corner with pumpkins, candles, and props. Dramatic lighting, background softly blurred, no people.',
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Summer_Beach',
          title: 'Summer beach',
          description: 'Summer products on sand with beach props.',
          prompt:
            'Photograph my summer essentials laid out on beach sand with chair, hat, and sea in the distance. Bright sunlight, background softly blurred, no people.',
        },
        {
          idSuffix: '12',
          name: 'Lifestyle_Winter_Mantle',
          title: 'Winter mantle styling',
          description: 'Decor arranged on a fireplace mantle.',
          prompt:
            'Capture my winter decorations styled on a fireplace mantle with stockings, garlands, and warm lights in a cozy living room. Background softly blurred, no people.',
        },
        {
          idSuffix: '13',
          name: 'Lifestyle_Spring_Garden',
          title: 'Spring garden vignette',
          description: 'Spring decor displayed outdoors with flowers.',
          prompt:
            'Photograph my spring seasonal products arranged on an outdoor table with fresh flowers and pastel textiles in a garden setting. Natural daylight, no people.',
        },
      ],
      'Detail Close-ups': [
        {
          idSuffix: '07',
          name: 'Detail_Ornament',
          title: 'Decor detail',
          description: 'Macro of a seasonal ornament.',
          prompt:
            'Macro detail of my seasonal ornament or decoration showing glitter and reflective surfaces with soft lighting. Background softly blurred, no text.',
        },
        {
          idSuffix: '08',
          name: 'Detail_Costume_Fabric',
          title: 'Costume fabric',
          description: 'Close-up of costume texture and stitching.',
          prompt:
            'Close-up of my costume fabric highlighting stitching, sequins, or pattern with side lighting. Neutral background, no text.',
        },
        {
          idSuffix: '09',
          name: 'Detail_Summer_Texture',
          title: 'Summer materials',
          description: 'Macro texture of towels or straw hats.',
          prompt:
            'Macro capture of my summer material—woven hat, towel fiber—showing texture with bright controlled light. Neutral background, no text.',
        },
        {
          idSuffix: '14',
          name: 'Detail_Ornament_Sparkle',
          title: 'Sparkling ornament detail',
          description: 'Macro of glittering ornament facets.',
          prompt:
            'Capture a macro detail of my holiday ornament facets catching light to create sparkling bokeh with a softly blurred festive background. No text.',
        },
        {
          idSuffix: '15',
          name: 'Detail_Costume_Accessory',
          title: 'Costume accessory macro',
          description: 'Close-up of costume accessories or trims.',
          prompt:
            'Photograph a macro view of my costume accessory—mask, sequined trim, or ribbon—highlighting texture with side lighting and shallow depth of field. No text.',
        },
      ],
    },
  },

  // Health & Supplements
  health_supplements: {
    label: 'Health & Supplements',
    subcategories: [
      { id: 'vitamins_minerals', label: 'Vitamins & Minerals' },
      { id: 'protein_powders', label: 'Protein Powders' },
      { id: 'workout_supplements', label: 'Pre/Post-Workout' },
    ],
    groups: {
      'Studio Hero Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Bottle_Clean',
          title: 'Clean supplement bottle hero',
          description: 'Product bottle on white seamless with shadow and professional lighting.',
          prompt:
            'Create a premium studio photo of my supplement bottle centered on a seamless white background. Use soft diffused lighting with a subtle shadow beneath to add depth. Bottle label facing camera, crisp focus, true-to-life colors. No text overlays or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Multiple_Arranged',
          title: 'Product family arrangement',
          description: 'Multiple supplement containers arranged at angles showing product line.',
          prompt:
            'Generate a studio shot of my supplement product line with 2-3 bottles/containers arranged at dynamic angles on a light grey seamless backdrop. Balanced lighting highlights each product while maintaining visual hierarchy. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Scoop_Powder',
          title: 'Powder with scoop detail',
          description: 'Protein powder container with measuring scoop showing product texture.',
          prompt:
            'Photograph my supplement powder container with lid off and measuring scoop filled with powder resting nearby on clean white surface. Soft overhead lighting shows powder texture. Background seamless neutral. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Pills_Spill',
          title: 'Capsules artfully displayed',
          description: 'Vitamin capsules tastefully spilling from bottle showing product.',
          prompt:
            'Create a studio image of my vitamin/supplement capsules elegantly spilling from the bottle onto a pristine white surface. Macro focus on capsule clarity and color. Soft diffused lighting, clean composition. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Label_Focus',
          title: 'Label detail close-up',
          description: 'Tight crop on product label with professional studio lighting.',
          prompt:
            'Generate a close-up studio shot focused on my supplement bottle label at a slight angle. Background softly blurred. Directional lighting enhances label legibility while maintaining premium feel. No added text or watermarks.',
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Kitchen_Counter',
          title: 'Morning kitchen routine',
          description: 'Supplement on kitchen counter with breakfast elements suggesting daily use.',
          prompt:
            'Photograph my supplement product on a bright modern kitchen counter with a glass of water, fresh fruit, and morning light streaming through window. Shallow depth of field keeps product in focus. No people, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Gym_Bag',
          title: 'Gym bag essentials',
          description: 'Supplement with gym equipment suggesting fitness lifestyle.',
          prompt:
            'Create a lifestyle flatlay of my workout supplement with gym towel, water bottle, and dumbbells on dark textured surface. Natural light from side, product positioned prominently. No people or text overlays.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Shaker_Bottle',
          title: 'Protein shaker preparation',
          description: 'Supplement next to shaker bottle suggesting pre-workout moment.',
          prompt:
            'Generate a lifestyle shot of my supplement container next to a clear shaker bottle on a fitness mat with gym in soft background blur. Warm natural lighting, clean composition. No people, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Wellness_Flat',
          title: 'Wellness routine flatlay',
          description: 'Supplement as part of healthy lifestyle arrangement.',
          prompt:
            'Create a top-down flatlay of my supplement with yoga mat, green smoothie, measuring tape, and wellness journal on light wood surface. Soft diffused lighting, organized composition. No hands, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Outdoor_Active',
          title: 'Active outdoor lifestyle',
          description: 'Product in outdoor fitness context with natural lighting.',
          prompt:
            'Photograph my supplement product resting on outdoor workout equipment or park bench with natural daylight and soft bokeh background. Product sharp and prominent. No people, no text overlays.',
        },
      ],
    },
  },

  // Fitness & Sports Equipment
  fitness_sports: {
    label: 'Fitness & Sports Equipment',
    subcategories: [
      { id: 'gym_equipment', label: 'Gym Equipment' },
      { id: 'yoga_pilates', label: 'Yoga & Pilates' },
      { id: 'running_gear', label: 'Running Gear' },
    ],
    groups: {
      'Studio Product Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Equipment_Hero',
          title: 'Isolated equipment hero',
          description: 'Fitness equipment on clean background with studio lighting.',
          prompt:
            'Create a premium studio photograph of my fitness equipment centered on seamless white or light grey background. Use soft directional lighting with controlled shadows to show product form and texture. Crisp focus, accurate colors. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Multi_Angle',
          title: 'Multiple equipment display',
          description: 'Several pieces of equipment arranged to show product range.',
          prompt:
            'Generate a studio shot of 2-3 pieces of my fitness equipment arranged at complementary angles on neutral background. Balanced lighting highlights each item while creating visual depth. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Detail_Close',
          title: 'Equipment detail close-up',
          description: 'Macro shot showing material quality and construction.',
          prompt:
            'Photograph a close-up detail of my fitness equipment focusing on grip texture, material quality, or adjustment mechanism. Seamless background, directional lighting emphasizes craftsmanship. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Color_Pop',
          title: 'Color-blocked equipment shot',
          description: 'Equipment on colored backdrop highlighting product aesthetic.',
          prompt:
            'Create a studio image of my fitness equipment on a bold colored seamless backdrop that complements the product. Soft gradient lighting, clean shadows, product centered and sharp. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Overhead_Flat',
          title: 'Top-down equipment layout',
          description: 'Overhead view showing equipment and accessories together.',
          prompt:
            'Generate a top-down studio photograph of my fitness equipment with related accessories arranged symmetrically on clean neutral surface. Even overhead lighting, organized composition. No text or watermarks.',
        },
      ],
      'In-Use Lifestyle': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Gym_Action',
          title: 'Gym floor in use',
          description: 'Equipment in realistic gym environment showing functionality.',
          prompt:
            'Photograph my fitness equipment in a modern gym setting with blurred background. Natural gym lighting, equipment positioned prominently showing scale and context. No faces or text overlays.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Home_Workout',
          title: 'Home workout space',
          description: 'Equipment in home environment suggesting convenience.',
          prompt:
            'Create a lifestyle shot of my fitness equipment in a bright home living space with natural window light. Background softly blurred, product sharp and inviting. No people, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Outdoor_Park',
          title: 'Outdoor training scene',
          description: 'Equipment in outdoor fitness context with natural environment.',
          prompt:
            'Generate an outdoor lifestyle image of my fitness equipment on grass or park setting with golden hour lighting and natural bokeh. Product clear and prominent. No people, no text overlays.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Mat_Setup',
          title: 'Yoga mat setup ready',
          description: 'Equipment arranged on yoga mat suggesting ready-to-use.',
          prompt:
            'Photograph my fitness equipment neatly arranged on a yoga mat with water bottle and towel nearby in a calm workout space. Soft natural light, organized composition. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Morning_Routine',
          title: 'Morning workout preparation',
          description: 'Equipment ready for morning workout with inspiring lighting.',
          prompt:
            'Create a lifestyle shot of my fitness equipment positioned for morning workout with warm sunrise light streaming through window. Clean minimalist space, product sharp. No people or text.',
        },
      ],
    },
  },

  // Electronics - Smartphones & Devices
  electronics_devices: {
    label: 'Electronics & Devices',
    subcategories: [
      { id: 'smartphones', label: 'Smartphones' },
      { id: 'tablets', label: 'Tablets' },
      { id: 'laptops', label: 'Laptops' },
      { id: 'smartwatches', label: 'Smartwatches' },
    ],
    groups: {
      'Studio Product Photography': [
        {
          idSuffix: '01',
          name: 'Studio_Device_Front',
          title: 'Front-facing device hero',
          description: 'Device front view on clean background with screen visible.',
          prompt:
            'Create a premium studio photograph of my electronic device displayed front-facing on seamless white background. Screen shows subtle gradient or wallpaper, no UI elements. Soft diffused lighting with gentle rim, accurate colors. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Multi_Angle',
          title: 'Multiple angle showcase',
          description: 'Device shown from multiple angles displaying design.',
          prompt:
            'Generate a studio composition of my device shown from 2-3 angles (front, back, side) arranged artfully on light grey seamless. Balanced lighting highlights design elements and finish. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Floating_Render',
          title: 'Floating device render',
          description: 'Device suspended in space with dramatic lighting.',
          prompt:
            'Photograph my electronic device in a floating composition with subtle shadow beneath on seamless gradient background. Directional lighting creates depth, screen glowing softly. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Detail_Edge',
          title: 'Edge design close-up',
          description: 'Macro detail of device edge, buttons, and craftsmanship.',
          prompt:
            'Create a macro studio shot focusing on my device edge, showing button detail and material finish. Background softly gradient, side lighting emphasizes precision. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Family_Lineup',
          title: 'Product family display',
          description: 'Multiple devices from product line arranged together.',
          prompt:
            'Generate a studio shot of my device family lineup arranged by size on clean white background. Even lighting, consistent spacing, creating professional product catalogue feel. No text or watermarks.',
        },
      ],
      'Lifestyle & Context': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Desk_Workspace',
          title: 'Modern workspace setup',
          description: 'Device on professional desk with complementary tech items.',
          prompt:
            'Photograph my device on a modern minimalist desk with wireless keyboard, coffee cup, and notebook. Natural window light from left, device screen glowing softly. No hands, no text overlays.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Hand_Holding',
          title: 'Hand-held product view',
          description: 'Device held naturally showing size and interface.',
          prompt:
            'Create a lifestyle shot of hands naturally holding my device at a comfortable viewing angle in bright indoor environment. Background softly blurred, screen visible with neutral content. No faces, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Cafe_Scene',
          title: 'Coffee shop environment',
          description: 'Device in casual social setting suggesting portability.',
          prompt:
            'Generate a lifestyle image of my device on a café table with coffee cup and soft ambient lighting. Shallow depth of field, warm tones, device as focal point. No people, no text overlays.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Travel_Ready',
          title: 'Travel and portability',
          description: 'Device with travel items suggesting on-the-go lifestyle.',
          prompt:
            'Photograph my device arranged with passport, headphones, and boarding pass on carry-on bag suggesting travel readiness. Soft natural light, clean composition. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Home_Relaxation',
          title: 'Home entertainment setup',
          description: 'Device in cozy home environment for media consumption.',
          prompt:
            'Create a lifestyle shot of my device on a cozy sofa with soft blanket and warm lamp light in background. Screen glowing with media content, inviting atmosphere. No people, no text.',
        },
      ],
    },
  },

  // Mobile Accessories
  mobile_accessories: {
    label: 'Mobile Accessories',
    subcategories: [
      { id: 'phone_cases', label: 'Phone Cases' },
      { id: 'screen_protectors', label: 'Screen Protectors' },
      { id: 'chargers_cables', label: 'Chargers & Cables' },
      { id: 'headphones', label: 'Earphones & Headphones' },
      { id: 'power_banks', label: 'Power Banks' },
    ],
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_Accessory_Hero',
          title: 'Clean accessory hero shot',
          description: 'Mobile accessory centered on seamless background.',
          prompt:
            'Create a premium studio photograph of my mobile accessory centered on seamless white or light grey background. Soft diffused lighting with subtle shadow for depth. Sharp focus, accurate colors, clean composition. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_With_Device',
          title: 'Accessory with device',
          description: 'Accessory shown with compatible device for scale and context.',
          prompt:
            'Generate a studio shot of my mobile accessory paired with a smartphone to show compatibility and scale. Light grey seamless background, balanced lighting on both items. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Color_Options',
          title: 'Multiple color variants',
          description: 'Product shown in available color options.',
          prompt:
            'Photograph my mobile accessory in 2-4 available colors arranged in a clean line on white seamless background. Even lighting, consistent spacing, showcasing variety. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Detail_Close',
          title: 'Material detail macro',
          description: 'Close-up showing material quality and texture.',
          prompt:
            'Create a macro studio shot of my mobile accessory focusing on material texture, stitching, or finish quality. Background softly gradient, directional lighting reveals detail. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Packaging_Unbox',
          title: 'Premium unboxing shot',
          description: 'Product with elegant packaging showing presentation.',
          prompt:
            'Generate a studio image of my mobile accessory partially removed from premium packaging on clean surface. Soft overhead lighting, organized composition suggesting quality. No text or watermarks.',
        },
      ],
      'Lifestyle Usage': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Desk_Tech',
          title: 'Desk workspace context',
          description: 'Accessory on modern desk with other tech items.',
          prompt:
            'Photograph my mobile accessory on a modern desk workspace with laptop, notebook, and coffee. Natural window light, device in use or nearby, clean organized scene. No hands, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Commute_Travel',
          title: 'Commuter lifestyle',
          description: 'Accessory in travel context showing portability.',
          prompt:
            'Create a lifestyle shot of my mobile accessory in a travel bag with headphones, tablet, and passport. Soft ambient light, suggesting on-the-go lifestyle. No people, no text overlays.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Charging_Night',
          title: 'Nighttime charging setup',
          description: 'Accessory on nightstand suggesting daily routine.',
          prompt:
            'Generate a lifestyle image of my mobile accessory on a bedside nightstand with phone charging and soft lamp glow. Warm cozy lighting, peaceful evening atmosphere. No people, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Outdoor_Active',
          title: 'Active outdoor lifestyle',
          description: 'Accessory in active outdoor setting showing durability.',
          prompt:
            'Photograph my mobile accessory in an outdoor setting with natural daylight, suggesting active lifestyle use. Background softly blurred nature, product sharp and prominent. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Car_Mount',
          title: 'Car accessory in use',
          description: 'Accessory mounted in vehicle interior.',
          prompt:
            'Create a lifestyle shot of my mobile accessory in use inside a modern car interior with soft dashboard lighting. Product functional and clear, background slightly blurred. No people, no text.',
        },
      ],
    },
  },

  // Home Appliances
  home_appliances: {
    label: 'Home Appliances',
    subcategories: [
      { id: 'kitchen_appliances', label: 'Kitchen Appliances' },
      { id: 'cleaning_appliances', label: 'Cleaning Appliances' },
      { id: 'personal_care', label: 'Personal Care Appliances' },
      { id: 'smart_home', label: 'Smart Home Devices' },
    ],
    groups: {
      'Studio Product Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Appliance_Hero',
          title: 'Clean appliance hero',
          description: 'Appliance on seamless background with professional lighting.',
          prompt:
            'Create a premium studio photograph of my home appliance centered on seamless white or light grey background. Soft directional lighting highlights form and finish with controlled shadows. Crisp focus, accurate colors. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Features_Detail',
          title: 'Control panel close-up',
          description: 'Close-up of interface, buttons, or key features.',
          prompt:
            'Generate a studio close-up of my appliance control panel or key feature with soft lighting to show interface clarity. Background neutral and blurred, focus on usability. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Multiple_Angle',
          title: 'Multi-angle product view',
          description: 'Appliance shown from multiple angles revealing design.',
          prompt:
            'Photograph my appliance from 2-3 different angles arranged in one frame on light background. Balanced lighting shows form, material, and build quality. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_With_Accessories',
          title: 'Appliance with accessories',
          description: 'Product shown with included attachments or accessories.',
          prompt:
            'Create a studio shot of my appliance with its accessories neatly arranged around it on white seamless. Even overhead lighting, organized composition showing complete package. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Size_Scale',
          title: 'Product size reference',
          description: 'Appliance with subtle scale reference showing dimensions.',
          prompt:
            'Generate a studio photograph of my appliance with subtle size reference like a coffee cup or book nearby to show scale. Clean background, soft lighting, product as primary focus. No text or watermarks.',
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Kitchen_Counter',
          title: 'Kitchen counter setup',
          description: 'Appliance on modern kitchen counter in use context.',
          prompt:
            'Photograph my appliance on a bright modern kitchen counter with fresh ingredients or coffee nearby. Natural window light, clean organized space, appliance as hero. No people, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Morning_Routine',
          title: 'Morning routine scene',
          description: 'Appliance in daily morning use scenario.',
          prompt:
            'Create a lifestyle shot of my appliance in use during morning routine with warm sunrise light streaming through window. Breakfast items or personal care products nearby, inviting atmosphere. No people, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Clean_Home',
          title: 'Modern home environment',
          description: 'Appliance in styled contemporary home setting.',
          prompt:
            'Generate a lifestyle image of my appliance in a beautifully styled modern home with natural decor and soft ambient lighting. Background shows lifestyle context, appliance positioned prominently. No people, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_In_Action',
          title: 'Appliance actively working',
          description: 'Product shown mid-use with steam, light, or motion.',
          prompt:
            'Photograph my appliance actively working with visible steam, LED lights, or motion blur suggesting function. Dramatic lighting, dynamic composition, product clearly visible. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Before_After',
          title: 'Results demonstration',
          description: 'Appliance with visible results showing effectiveness.',
          prompt:
            'Create a split or sequential lifestyle shot showing my appliance with visible before/after results of its use. Clean composition, natural lighting, demonstrating product value. No people, no text.',
        },
      ],
    },
  },

  // Furniture & Home Decor
  furniture_decor: {
    label: 'Furniture & Home Decor',
    subcategories: [
      { id: 'seating', label: 'Sofas & Chairs' },
      { id: 'tables', label: 'Tables & Desks' },
      { id: 'lighting', label: 'Lamps & Lighting' },
      { id: 'wall_decor', label: 'Wall Art & Decor' },
    ],
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_Furniture_Isolated',
          title: 'Isolated furniture hero',
          description: 'Furniture piece on clean background showing design.',
          prompt:
            'Create a premium studio photograph of my furniture piece centered on seamless white or light grey floor and background. Soft directional lighting reveals texture, form, and craftsmanship. No props, no text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Angle_Detail',
          title: 'Three-quarter angle shot',
          description: 'Furniture at an angle showing depth and construction.',
          prompt:
            'Generate a studio shot of my furniture at a 45-degree angle to show depth, leg design, and structure. Light grey seamless, balanced lighting, shadows controlled. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Material_Close',
          title: 'Material detail close-up',
          description: 'Macro of upholstery, wood grain, or finish quality.',
          prompt:
            'Photograph a close-up detail of my furniture focusing on material texture, stitching, or wood grain. Seamless neutral background, directional lighting emphasizes quality. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Color_Variant',
          title: 'Multiple finish options',
          description: 'Same piece shown in different colors or materials.',
          prompt:
            'Create a studio composition showing my furniture in 2-3 available finishes or fabric options side by side on white background. Even lighting, professional catalogue style. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Feature_Highlight',
          title: 'Functional feature focus',
          description: 'Close-up on adjustable, storage, or special features.',
          prompt:
            'Generate a studio shot highlighting a key feature of my furniture like storage compartment, reclining mechanism, or modular aspect. Clean background, clear demonstration angle. No text or watermarks.',
        },
      ],
      'Styled Room Settings': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Living_Room',
          title: 'Living room styled scene',
          description: 'Furniture in beautifully styled living space.',
          prompt:
            'Photograph my furniture piece in a modern living room with complementary decor, plants, and natural window light. Furniture as focal point, room styled but not cluttered. No people, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Reading_Corner',
          title: 'Cozy reading nook',
          description: 'Furniture creating an inviting relaxation space.',
          prompt:
            'Create a lifestyle shot of my furniture arranged in a cozy corner with throw blanket, small side table, and warm lamp lighting. Inviting atmosphere, soft natural tones. No people, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Workspace_Setup',
          title: 'Home office environment',
          description: 'Furniture in productive workspace setting.',
          prompt:
            'Generate a lifestyle image of my furniture in a bright home office with laptop, books, and organized desk accessories. Natural daylight, clean professional aesthetic. No people, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Dining_Scene',
          title: 'Dining area setup',
          description: 'Furniture styled for dining or entertaining.',
          prompt:
            'Photograph my furniture in a dining setting with elegant table styling, soft chandelier light, and modern decor. Warm inviting atmosphere, furniture clearly visible. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Bedroom_Retreat',
          title: 'Bedroom sanctuary scene',
          description: 'Furniture creating peaceful bedroom environment.',
          prompt:
            'Create a lifestyle shot of my furniture in a serene bedroom with soft bedding, gentle lamp light, and calming color palette. Peaceful atmosphere, morning or evening light. No people, no text.',
        },
      ],
    },
  },

  // Food & Beverages
  food_beverages: {
    label: 'Food & Beverages',
    subcategories: [
      { id: 'coffee_tea', label: 'Coffee & Tea' },
      { id: 'organic_healthy', label: 'Organic & Healthy Foods' },
      { id: 'snacks', label: 'Snacks & Sweets' },
      { id: 'gourmet_specialty', label: 'Gourmet & Specialty' },
    ],
    groups: {
      'Studio Product Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Package_Hero',
          title: 'Product packaging hero',
          description: 'Food product packaging on clean background.',
          prompt:
            'Create a premium studio photograph of my food product packaging centered on seamless white background. Soft diffused lighting with subtle shadow shows package design clearly. Colors accurate, sharp focus. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Ingredient_Splash',
          title: 'Ingredients showcase',
          description: 'Package with key ingredients artfully displayed.',
          prompt:
            'Generate a studio shot of my food product with fresh ingredients scattered artfully around package on neutral surface. Balanced lighting, clean composition highlighting natural aspects. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Open_Container',
          title: 'Product revealed in container',
          description: 'Package opened showing product inside.',
          prompt:
            'Photograph my food product in its opened packaging with contents visible on clean white surface. Overhead lighting, appetizing presentation, package label clearly shown. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Multiple_Products',
          title: 'Product line array',
          description: 'Multiple products from line arranged together.',
          prompt:
            'Create a studio composition of my food product line with 3-4 varieties arranged on light wood or white surface. Even lighting, organized display showing range. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Pour_Action',
          title: 'Dynamic pour shot',
          description: 'Product being poured or served in motion.',
          prompt:
            'Generate a studio action shot of my beverage product being poured into a clear glass against neutral background. Crisp freeze-frame, beautiful arc, liquid catching light. No text or watermarks.',
        },
      ],
      'Lifestyle & Culinary': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Breakfast_Table',
          title: 'Morning breakfast scene',
          description: 'Product as part of inviting breakfast spread.',
          prompt:
            'Photograph my food product on a bright breakfast table with fresh croissants, fruit, and coffee. Natural morning light through window, warm inviting atmosphere. No people, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Kitchen_Prep',
          title: 'Kitchen preparation moment',
          description: 'Product in cooking or meal prep context.',
          prompt:
            'Create a lifestyle shot of my food product on a modern kitchen counter with fresh ingredients and cooking utensils nearby. Natural light, clean organized scene, appetizing composition. No hands, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Cafe_Setting',
          title: 'Coffee shop atmosphere',
          description: 'Product in trendy café environment.',
          prompt:
            'Generate a lifestyle image of my food or beverage product on a rustic café table with soft ambient lighting and blurred background. Cozy inviting mood, product prominently displayed. No people, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Picnic_Outdoor',
          title: 'Outdoor picnic scene',
          description: 'Product in fresh air dining context.',
          prompt:
            'Photograph my food product arranged on a picnic blanket outdoors with natural daylight and soft bokeh background. Fresh inviting feel, product packaging clear. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Served_Plated',
          title: 'Beautifully plated serving',
          description: 'Product served on elegant dinnerware.',
          prompt:
            'Create a lifestyle shot of my food product beautifully plated on elegant dinnerware with garnish and ambient restaurant lighting. Appetizing presentation, shallow depth of field. No people, no text.',
        },
      ],
    },
  },

  // Baby & Kids Products
  baby_kids: {
    label: 'Baby & Kids Products',
    subcategories: [
      { id: 'baby_clothes', label: 'Baby Clothes' },
      { id: 'strollers_seats', label: 'Strollers & Car Seats' },
      { id: 'toys', label: 'Baby Toys' },
      { id: 'feeding', label: 'Feeding Products' },
    ],
    groups: {
      'Studio Product Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Product_Clean',
          title: 'Clean product hero shot',
          description: 'Baby product on soft pastel background.',
          prompt:
            'Create a premium studio photograph of my baby product centered on seamless soft pastel background. Gentle diffused lighting with soft shadows. Product clean and inviting, accurate colors. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Flatlay_Nursery',
          title: 'Nursery essentials flatlay',
          description: 'Baby items arranged in organized flatlay.',
          prompt:
            'Generate a top-down studio flatlay of my baby product with complementary nursery items like pacifiers, soft toys, arranged on white or cream surface. Soft overhead lighting, organized composition. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Detail_Safety',
          title: 'Safety feature close-up',
          description: 'Close-up showing safety features and quality.',
          prompt:
            'Photograph a close-up detail of my baby product focusing on safety features, soft materials, or quality construction. Neutral background, gentle lighting emphasizes care. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Size_Scale',
          title: 'Product with size reference',
          description: 'Baby item with subtle size indicator.',
          prompt:
            'Create a studio shot of my baby product with a subtle size reference like a hand outline or measuring ribbon on clean background. Soft lighting, product proportions clear. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Color_Options',
          title: 'Available color variants',
          description: 'Product shown in multiple gentle colors.',
          prompt:
            'Generate a studio image of my baby product in 2-3 available pastel colors arranged on white seamless. Even soft lighting, showing variety while maintaining peaceful aesthetic. No text or watermarks.',
        },
      ],
      'Lifestyle Scenes': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Nursery_Room',
          title: 'Styled nursery setting',
          description: 'Product in beautiful nursery environment.',
          prompt:
            'Photograph my baby product in a beautifully styled nursery with soft natural light, gentle colors, and cozy decor. Product positioned naturally, peaceful atmosphere. No people visible, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Playtime_Setup',
          title: 'Playtime arrangement',
          description: 'Product in engaging play context.',
          prompt:
            'Create a lifestyle shot of my baby product arranged in a bright playroom with soft toys and pastel colors. Natural window light, inviting safe environment suggested. No children visible, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Parent_POV',
          title: 'Parent perspective view',
          description: 'Product from parent caring viewpoint.',
          prompt:
            'Generate a lifestyle image from parent perspective showing my baby product ready for use on a changing table or crib side. Warm natural lighting, organized caring environment. No people, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Travel_Ready',
          title: 'On-the-go preparation',
          description: 'Product with travel bag suggesting portability.',
          prompt:
            'Photograph my baby product with diaper bag and travel essentials on clean surface suggesting on-the-go convenience. Soft natural light, organized practical scene. No people, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Bath_Routine',
          title: 'Bath time setting',
          description: 'Product in clean bathroom environment.',
          prompt:
            'Create a lifestyle shot of my baby product in a bright clean bathroom with soft towels and gentle lighting. Peaceful bath time atmosphere, product clearly visible. No people, no text.',
        },
      ],
    },
  },

  // Toys & Hobbies
  toys_hobbies: {
    label: 'Toys & Hobbies',
    subcategories: [
      { id: 'building_sets', label: 'Building Sets' },
      { id: 'dolls_figures', label: 'Dolls & Action Figures' },
      { id: 'board_games', label: 'Board Games' },
      { id: 'craft_kits', label: 'DIY Craft Kits' },
    ],
    groups: {
      'Studio Product Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Toy_Hero',
          title: 'Toy product hero shot',
          description: 'Toy on vibrant background showing features.',
          prompt:
            'Create a premium studio photograph of my toy product centered on seamless colorful or white background. Bright even lighting shows details, colors accurate and vibrant. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Packaging_Box',
          title: 'Product in packaging',
          description: 'Toy in retail packaging showing presentation.',
          prompt:
            'Generate a studio shot of my toy in its original packaging on clean white background. Soft lighting shows package graphics clearly, product visible through window if applicable. No text overlays or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Parts_Spread',
          title: 'Components and pieces',
          description: 'Toy with parts arranged showing contents.',
          prompt:
            'Photograph my toy with all components and pieces neatly arranged in organized layout on white surface. Overhead lighting, clear view of everything included. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Action_Pose',
          title: 'Dynamic product pose',
          description: 'Toy positioned in exciting action stance.',
          prompt:
            'Create a studio shot of my action figure or toy in dynamic pose on seamless background with dramatic lighting. Product appears ready for adventure, shadows add depth. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Set_Complete',
          title: 'Completed set display',
          description: 'Built or assembled toy showing finished result.',
          prompt:
            'Generate a studio photograph of my building set or puzzle fully assembled on clean background. Balanced lighting shows completed achievement, inspiring composition. No text or watermarks.',
        },
      ],
      'Play Context Scenes': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Playroom_Scene',
          title: 'Playroom environment',
          description: 'Toy in colorful inviting play space.',
          prompt:
            'Photograph my toy in a bright colorful playroom with soft natural light and other toys softly blurred in background. Product positioned prominently, fun inviting atmosphere. No children, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Table_Game',
          title: 'Game night setup',
          description: 'Board game or toy set up on table ready to play.',
          prompt:
            'Create a lifestyle shot of my game or toy set up on a table with warm overhead lighting suggesting family game time. Inviting organized scene, product clearly visible. No people, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Craft_Table',
          title: 'Creative craft session',
          description: 'Craft kit with materials on work surface.',
          prompt:
            'Generate a lifestyle image of my craft kit with materials spread on a bright crafting table with natural window light. Colorful creative atmosphere, organized supplies. No hands, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Outdoor_Play',
          title: 'Outdoor play setting',
          description: 'Toy in outdoor play environment.',
          prompt:
            'Photograph my toy in an outdoor setting with natural daylight and grass or playground softly blurred. Product sharp and inviting, suggesting active play. No children, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Display_Shelf',
          title: 'Collection display',
          description: 'Toy attractively displayed on shelf.',
          prompt:
            'Create a lifestyle shot of my toy displayed on a modern shelf with other collectibles softly in background. Clean organized presentation, soft ambient lighting. No people, no text.',
        },
      ],
    },
  },

  // Pet Supplies
  pet_supplies: {
    label: 'Pet Supplies',
    subcategories: [
      { id: 'pet_food', label: 'Pet Food' },
      { id: 'beds_cages', label: 'Beds & Cages' },
      { id: 'toys_training', label: 'Toys & Training' },
      { id: 'grooming', label: 'Grooming Products' },
    ],
    groups: {
      'Studio Product Shots': [
        {
          idSuffix: '01',
          name: 'Studio_Pet_Product_Hero',
          title: 'Pet product hero shot',
          description: 'Pet item on clean background with professional lighting.',
          prompt:
            'Create a premium studio photograph of my pet product centered on seamless white or light grey background. Soft diffused lighting with controlled shadows. Product clean and appealing, accurate colors. No text or watermarks.',
        },
        {
          idSuffix: '02',
          name: 'Studio_Food_Bowl',
          title: 'Pet food presentation',
          description: 'Pet food product with serving bowl.',
          prompt:
            'Generate a studio shot of my pet food product with kibble or treats elegantly presented in a clean bowl beside the package. White background, appetizing lighting. No text or watermarks.',
        },
        {
          idSuffix: '03',
          name: 'Studio_Toy_Detail',
          title: 'Pet toy close-up',
          description: 'Macro showing toy texture and durability features.',
          prompt:
            'Photograph a close-up detail of my pet toy showing material texture, stitching, or squeaker feature. Seamless background, lighting emphasizes quality and safety. No text or watermarks.',
        },
        {
          idSuffix: '04',
          name: 'Studio_Size_Variants',
          title: 'Multiple size options',
          description: 'Product shown in available sizes for different pets.',
          prompt:
            'Create a studio composition of my pet product in 2-3 available sizes arranged on white background showing size range. Even lighting, clear size comparison. No text or watermarks.',
        },
        {
          idSuffix: '05',
          name: 'Studio_Grooming_Tools',
          title: 'Grooming kit display',
          description: 'Pet grooming products arranged professionally.',
          prompt:
            'Generate a studio flatlay of my pet grooming products neatly organized on neutral surface. Overhead lighting, clean professional presentation showing all components. No text or watermarks.',
        },
      ],
      'Pet Lifestyle Context': [
        {
          idSuffix: '06',
          name: 'Lifestyle_Cozy_Bed',
          title: 'Pet bed in home setting',
          description: 'Pet bed styled in cozy corner of room.',
          prompt:
            'Photograph my pet bed in a cozy corner of a bright living room with soft blanket and warm lighting. Inviting comfortable atmosphere, product clearly visible. No pets or people, no text.',
        },
        {
          idSuffix: '07',
          name: 'Lifestyle_Feeding_Station',
          title: 'Organized feeding area',
          description: 'Pet food products in clean feeding station.',
          prompt:
            'Create a lifestyle shot of my pet food product at a clean organized feeding station with mat, bowls, and storage. Natural light, tidy pet-care area. No pets or people, no text.',
        },
        {
          idSuffix: '08',
          name: 'Lifestyle_Play_Area',
          title: 'Pet play zone',
          description: 'Pet toys in designated play space.',
          prompt:
            'Generate a lifestyle image of my pet toys arranged in a bright play area with hardwood floor and natural light. Clean inviting space suggesting active pet household. No pets, no text.',
        },
        {
          idSuffix: '09',
          name: 'Lifestyle_Travel_Carrier',
          title: 'Travel ready setup',
          description: 'Pet carrier or travel product suggesting adventure.',
          prompt:
            'Photograph my pet travel product with leash, collar, and treats arranged suggesting adventure readiness. Bright natural light, organized practical scene. No pets, no text.',
        },
        {
          idSuffix: '10',
          name: 'Lifestyle_Grooming_Station',
          title: 'Home grooming setup',
          description: 'Grooming products in bathroom or grooming area.',
          prompt:
            'Create a lifestyle shot of my pet grooming products on a clean counter with towels and soft lighting suggesting care routine. Organized spa-like setting for pets. No animals, no text.',
        },
      ],
    },
  },
};

module.exports = categories;
