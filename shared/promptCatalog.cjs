const rawCatalog = {
  male: {
    label: 'Male',
    categories: {
      upper: {
        label: 'Upper Body',
        groups: {
          'Studio Editorials': [
            {
              idSuffix: '01',
              name: 'Studio_Model_FrontPose',
              prompt:
                "Create a premium studio editorial photo showing my garment on a European male model standing front facing with strong posture. Crop from chin to mid thigh. Background is seamless white or light grey. Lighting is soft and even with a gentle rim to separate the figure. Fabric texture sharp and natural. No text, logos, or watermarks.",
            },
            {
              idSuffix: '02',
              name: 'Studio_Model_SeatedChair',
              prompt:
                "Generate a high fashion studio photo of my garment on a European male model seated casually on a minimalist chair. Focus on torso and arms. Crop from waist up. Background is seamless white or light grey. Hands lightly adjusting cuff or collar. Lighting soft and natural to reveal fabric texture. No pants or shoes visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '03',
              name: 'Studio_Model_LeaningWall',
              prompt:
                "Create a cinematic studio editorial of my garment on a European male model leaning against a smooth neutral wall. Background is seamless white or light grey. Crop waist up. Use directional light across fabric to show weave and folds. Torso fills most of the frame. No text, logos, or watermarks.",
            },
            {
              idSuffix: '04',
              name: 'Studio_Model_AdjustingCollar',
              prompt:
                "Generate a studio editorial image of my garment on a European male model adjusting the collar or neckline. Crop to upper torso and shoulders only. Background is seamless light grey. Lighting is soft and balanced with even frontal illumination and a subtle rim. Fabric texture is clear and sharp. Hands look natural. No text, logos, or watermarks.",
            },
            {
              idSuffix: '05',
              name: 'Studio_Model_StepForward',
              prompt:
                "Create a premium studio editorial of my garment on a European male model stepping forward with confidence. Crop from chest to thigh. Do not show pants or shoes. Background is seamless white or light grey. Use soft key light with an additional rim. The torso fills most of the frame. Fabric details are sharp and clear. No text, logos, or watermarks.",
            },
          ],
          'Lifestyle Editorials': [
            {
              idSuffix: '06',
              name: 'Lifestyle_Model_StreetNeutral',
              prompt:
                "Generate a lifestyle editorial of my garment on a European male model standing on a minimalist modern street. Neutral toned paving and soft grey architecture blurred behind. Open shade daylight with shallow depth of field. Background muted so garment color stands out. Crop chest up. No text, logos, or watermarks.",
            },
            {
              idSuffix: '07',
              name: 'Lifestyle_Model_BalconyMinimal',
              prompt:
                "Create a lifestyle editorial of my garment on a European male model leaning on a clean balcony railing. Crop from chest to waist so garment fills the frame. Use golden hour light with shallow depth of field. City background blurred and muted so garment is hero. Fabric folds and fit sharp and detailed. No text, logos, or watermarks.",
            },
            {
              idSuffix: '08',
              name: 'Lifestyle_Model_MinimalArchitecture',
              prompt:
                "Generate a fashion editorial of my garment on a European male model against sleek minimalist architecture. Clean white concrete or travertine wall behind. Soft natural daylight with gentle shadows. Crop waist up. Garment structure and fit emphasized. No text, logos, or watermarks.",
            },
            {
              idSuffix: '09',
              name: 'Lifestyle_Model_SeatedSteps',
              prompt:
                "Create a lifestyle editorial of my garment on a European male model seated casually on wide neutral stone steps. Crop torso only. Soft overcast daylight with shallow depth of field. Neutral stone tones muted to emphasize garment. Hands interact with cuff or lapel. No text, logos, or watermarks.",
            },
            {
              idSuffix: '10',
              name: 'Lifestyle_Model_WindowLight',
              prompt:
                "Generate a lifestyle editorial of my garment on a European male model near a large modern window with neutral interior background. Soft daylight filters in with subtle rim light. Crop chest up. Light highlights folds and fabric texture. Interior colors muted so garment is focus. No text, logos, or watermarks.",
            },
          ],
          'Studio Close-ups': [
            {
              idSuffix: '11',
              name: 'Studio_Closeup_CollarTexture',
              prompt:
                "Create a studio close up of my garment on a European male model focused on collar and neckline. Background is seamless white or light grey. Raking light reveals stitching and fabric texture. True to life color. No text, logos, or watermarks.",
            },
            {
              idSuffix: '12',
              name: 'Studio_Closeup_FabricFold',
              prompt:
                "Generate a studio close up of my garment sleeve area on a European male model. Show natural folds and fabric texture. Background is seamless white or light grey. Lighting soft and controlled. Macro sharpness on fabric grain. No text, logos, or watermarks.",
            },
            {
              idSuffix: '13',
              name: 'Studio_Closeup_ButtonDetail',
              prompt:
                "Create a studio image of my garment on a European male model cropped mid chest with focus on buttons, zippers, or stitching. Background is seamless white or light grey. Soft cinematic light shows detail without glare. Fabric grain intact. No text, logos, or watermarks.",
            },
            {
              idSuffix: '14',
              name: 'Studio_Closeup_ShoulderStructure',
              prompt:
                "Generate a close up of my garment on a European male model cropped tightly on shoulder line and seam construction. Background is seamless white or light grey. Soft directional light with gentle negative fill. Material texture crisp. No text, logos, or watermarks.",
            },
            {
              idSuffix: '15',
              name: 'Studio_Closeup_CuffDetail',
              prompt:
                "Create a studio close up of my garment sleeve cuff on a European male model. Show stitching, material texture, and tailoring quality. Background is seamless white or light grey. Soft cinematic light. Fabric sharp and detailed. No text, logos, or watermarks.",
            },
          ],
          'Product Hero Shots': [
            {
              idSuffix: '16',
              name: 'Product_Hero_Suspended',
              prompt:
                "Create a luxury studio image of my male garment displayed on a minimal mannequin torso. The garment is the only focus. Garment is shown front facing with natural drape and structure. Background is seamless neutral white or light grey. Lighting is soft and even with gentle rim to highlight fabric texture and craftsmanship. No accessories, no props, no text, logos, or watermarks.",
            },
            {
              idSuffix: '17',
              name: 'Product_Closeup_Stitching',
              prompt:
                "Create an extreme close up studio shot of my garment showing stitching and seam construction. Use soft directional light to highlight thread detail and layers. Background neutral seamless. No text, logos, or watermarks.",
            },
            {
              idSuffix: '18',
              name: 'Product_Closeup_FabricWeave',
              prompt:
                "Generate a macro image of my garment fabric showing weave and texture in sharp detail. Raking light reveals depth without glare. Background minimal and neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '19',
              name: 'Product_Closeup_Fastening',
              prompt:
                "Create a close up studio shot of my garment focusing on a button, zipper, or fastening element. Show stitching and finishing details. Lighting balanced to avoid reflections. Background neutral seamless. No text, logos, or watermarks.",
            },
            {
              idSuffix: '20',
              name: 'Product_Closeup_CuffEdge',
              prompt:
                "Generate a macro shot of my garment sleeve cuff or garment edge. Highlight tailoring, stitching, and craftsmanship. Use soft cinematic light with controlled reflections. Background neutral seamless. No text, logos, or watermarks.",
            },
          ],
        },
      },
      lower: {
        label: 'Lower Body',
        groups: {
          'Studio Editorials': [
            {
              idSuffix: '01',
              name: 'Studio_Model_FrontPose',
              prompt:
                "Create a premium studio editorial photo showing my lower body garment on a European male model standing front facing. Crop from waist to shoes. Background is seamless white or light grey. Lighting is soft and even with a gentle rim. Fabric texture and fit are sharp and natural. Shoes are neutral and minimal. No text, logos, or watermarks.",
            },
            {
              idSuffix: '02',
              name: 'Studio_Model_SeatedChair',
              prompt:
                "Generate a studio photo showing my lower body garment while the European male model sits on a minimalist chair. Crop from waist to shoes. Knees bent to show ease and natural creases. Background is seamless white or light grey. Lighting soft and natural to reveal fabric texture. Shoes are neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '03',
              name: 'Studio_Model_SideProfile',
              prompt:
                "Create a studio editorial showing my lower body garment in a clean side profile. Crop from waist to shoes. Background is seamless white or light grey. Use directional light across the fabric to show drape and leg line. Hem and cuff visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '04',
              name: 'Studio_Model_AdjustWaist',
              prompt:
                "Generate a studio image of my lower body garment while the European male model lightly adjusts the waistband or drawstring. Crop from waist to mid calf. Background is seamless light grey. Lighting is soft and balanced with even frontal illumination and a subtle rim. Stitching and waistband details are clear and sharp. Hands look natural. No text, logos, or watermarks.",
            },
            {
              idSuffix: '05',
              name: 'Studio_Model_StepForward',
              prompt:
                "Create a premium studio editorial of my lower body garment while the European male model steps forward. Crop from waist to shoes. Background is seamless white or light grey. Use soft key and rim light. The legs fill most of the frame. Show fabric movement and hem behavior. Shoes are neutral. No text, logos, or watermarks.",
            },
          ],
          'Lifestyle Editorials': [
            {
              idSuffix: '06',
              name: 'Lifestyle_Model_StreetNeutral',
              prompt:
                "Generate a lifestyle editorial of my lower body garment on a minimalist modern street. Crop from waist to shoes. Neutral paving and soft grey architecture blurred behind. Open shade daylight with shallow depth of field. Background muted so garment color stands out. Shoes neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '07',
              name: 'Lifestyle_Model_BalconyMinimal',
              prompt:
                "Create a lifestyle editorial of my lower body garment on a clean balcony. Crop from waist to shoes so the garment fills the frame. Use golden hour light with shallow depth of field. City background blurred and muted so the garment is hero. Show folds and fit clearly. Shoes neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '08',
              name: 'Lifestyle_Model_MinimalArchitecture',
              prompt:
                "Generate a fashion editorial of my lower body garment against sleek minimalist architecture. Crop from waist to shoes. Clean white concrete or travertine behind with gentle shadows. Soft natural daylight. Emphasize leg line, drape, and side stripe or seam if present. No text, logos, or watermarks.",
            },
            {
              idSuffix: '09',
              name: 'Lifestyle_Model_StepsSeated',
              prompt:
                "Create a lifestyle editorial of my lower body garment while the European male model sits on wide neutral stone steps. Crop from waist to shoes. Soft overcast daylight with shallow depth of field. Neutral stone tones muted to emphasize the garment. Hands can rest near knee or adjust cuff. Shoes neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '10',
              name: 'Lifestyle_Model_WalkingMotion',
              prompt:
                "Generate a lifestyle editorial of my lower body garment captured mid step on a clean sidewalk. Crop from waist to shoes. Use soft daylight and a fast shutter feel for crisp motion. Background muted so the garment is focus. Show hem movement and drape. Shoes neutral. No text, logos, or watermarks.",
            },
          ],
          'Studio Close-ups': [
            {
              idSuffix: '11',
              name: 'Studio_Closeup_Waistband',
              prompt:
                "Create a studio close up of my lower body garment focused on the waistband and closure. Show drawstring, button, or zipper clearly. Background is seamless white or light grey. Raking light reveals stitching and fabric texture. True to life color. No text, logos, or watermarks.",
            },
            {
              idSuffix: '12',
              name: 'Studio_Closeup_PocketDetail',
              prompt:
                "Generate a studio close up focused on a pocket detail. Show opening, stitching, and bar tacks. Background is seamless white or light grey. Lighting soft and controlled. Macro sharpness on fabric grain. No text, logos, or watermarks.",
            },
            {
              idSuffix: '13',
              name: 'Studio_Closeup_SideStripeSeam',
              prompt:
                "Create a studio image focused on the side seam or side stripe. Crop tight to show construction and pattern alignment. Background is seamless white or light grey. Soft cinematic light shows detail without glare. No text, logos, or watermarks.",
            },
            {
              idSuffix: '14',
              name: 'Studio_Closeup_FabricTextureLeg',
              prompt:
                "Generate a close up of the leg fabric showing texture and weave direction. Background is seamless white or light grey. Soft directional light with gentle negative fill. Material texture crisp. No text, logos, or watermarks.",
            },
            {
              idSuffix: '15',
              name: 'Studio_Closeup_HemCuff',
              prompt:
                "Create a studio close up of the hem or cuff. Show stitching, clean finishing, and how the fabric breaks on the shoe. Background is seamless white or light grey. Soft cinematic light. Fabric sharp and detailed. No text, logos, or watermarks.",
            },
          ],
          'Product Hero Shots': [
            {
              idSuffix: '16',
              name: 'Product_Hero_MannequinLower',
              prompt:
                "Create a luxury studio flatlay of my lower body garment arranged diagonally on a smooth dark neutral surface. Legs are neatly aligned with one leg slightly folded for dimension. Camera angle is top down with slight perspective for depth. Use soft raking light from one side to emphasize fabric texture and weave. Subtle gradient shadowing on surface for a premium look. Colors true to life. No text, logos, or watermarks.",
            },
            {
              idSuffix: '17',
              name: 'Product_Flatlay_LegFold',
              prompt:
                "Create a luxury studio image of my lower body garment draped in a clean, structured way over a minimal pedestal or chair edge. The garment must be the dominant subject, filling most of the frame. Arrange neatly so the waistband and one leg are fully visible, with smooth folds that clearly show silhouette and fabric texture. Background is seamless neutral with soft gradient depth. Lighting is soft directional, highlighting material quality and weave while keeping support object minimal and unobtrusive. No clutter, no text, logos, or watermarks.",
            },
            {
              idSuffix: '18',
              name: 'Product_Closeup_Stitching',
              prompt:
                "Create an extreme close up studio shot showing stitching and seam construction. Use soft directional light to highlight thread detail and layers. Background neutral seamless. No text, logos, or watermarks.",
            },
            {
              idSuffix: '19',
              name: 'Product_Closeup_FabricWeave',
              prompt:
                "Generate a macro image of the fabric showing weave or knit texture in sharp detail. Raking light reveals depth without glare. Background minimal and neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '20',
              name: 'Product_Closeup_WaistInterior',
              prompt:
                "Generate a macro studio close up of my lower body garment focused on the zipper, button, or pocket opening. Show stitching, hardware finish, and clean construction details. Background is seamless neutral. Use raking light to reveal texture while keeping metal highlights controlled. No text, logos, or watermarks.",
            },
          ],
        },
      },
      footwear: {
        label: 'Footwear',
        groups: {
          'Studio Presentation': [
            {
              idSuffix: '01',
              name: 'Studio_Single_SideProfile',
              prompt:
                "Create a premium studio photo of my footwear shown in clean side profile. One shoe only. Background seamless white or light grey. Lighting soft diffused with subtle rim for depth. Shoe centered, crisp focus, true-to-life color. No text, logos, or watermarks.",
            },
            {
              idSuffix: '02',
              name: 'Studio_Pair_Angled',
              prompt:
                "Generate a studio editorial showing both shoes angled at 45 degrees to reveal front and side. Background seamless light grey. Lighting balanced, natural, with soft highlights on leather or fabric texture. Shadows subtle and realistic. No text, logos, or watermarks.",
            },
            {
              idSuffix: '03',
              name: 'Studio_Single_Tilted',
              prompt:
                "Create a studio product shot of my footwear tilted slightly upward on a pedestal block, front quarter angle. Background seamless white. Lighting diffused and premium, highlighting material quality. No logos, no text, no watermarks.",
            },
            {
              idSuffix: '04',
              name: 'Studio_Pair_Overhead',
              prompt:
                "Generate a clean studio overhead shot of both shoes side by side, one slightly forward, showing silhouette and symmetry. Background seamless light neutral grey. Soft natural light, subtle shadows, sharp detail. No text, logos, or watermarks.",
            },
            {
              idSuffix: '05',
              name: 'Studio_Single_Diagonal',
              prompt:
                "Create a studio image of one shoe placed diagonally across the frame, toe pointing slightly outward. Background seamless white with soft gradient depth. Lighting natural daylight style. No text, logos, or watermarks.",
            },
          ],
          'Lifestyle Wear': [
            {
              idSuffix: '06',
              name: 'Lifestyle_Model_SeatedBench',
              prompt:
                "Generate a lifestyle photo of a European male model seated casually outdoors on a neutral wooden bench, shoes clearly visible and dominant. Crop below knees. Bare ankles, no socks. Natural daylight with shallow depth of field. No text, logos, or watermarks.",
            },
            {
              idSuffix: '07',
              name: 'Lifestyle_Model_WalkingStreet',
              prompt:
                "Create a lifestyle editorial of a European male model walking on a clean modern sidewalk. Crop mid-shin down so shoes are dominant. Bare ankles, no socks. Shoes fill most of the frame. Background muted. No text, logos, or watermarks.",
            },
            {
              idSuffix: '08',
              name: 'Lifestyle_Model_OutdoorStep',
              prompt:
                "Generate a lifestyle image of my footwear worn by a European male model on wide stone steps. Crop from mid-shin down. Shoes in crisp focus, bare ankles, no socks. Background blurred and muted. Lighting soft overcast daylight. No text, logos, or watermarks.",
            },
            {
              idSuffix: '09',
              name: 'Lifestyle_Model_LeaningFence',
              prompt:
                "Create a lifestyle editorial with a European male model leaning casually against a wooden fence outdoors. Legs slightly crossed, shoes clearly visible in focus. Bare ankles, no socks. Natural golden hour light. Background blurred. No text, logos, or watermarks.",
            },
            {
              idSuffix: '10',
              name: 'Lifestyle_Model_SittingEdge',
              prompt:
                "Generate a lifestyle photo of a European male model sitting on the edge of a stone ledge, one leg bent, one extended. Shoes in sharp focus. Bare ankles, no socks. Soft daylight illumination, background slightly blurred. No text, logos, or watermarks.",
            },
          ],
          'Floating Renders': [
            {
              idSuffix: '11',
              name: 'Render_Single_Angled',
              prompt:
                "Create a floating render of my footwear, one shoe only, angled 45 degrees to show front and side profile. Background seamless light grey. Lighting cinematic but soft, shoe hovering gracefully with natural shadow beneath. No outsole bottom visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '12',
              name: 'Render_Pair_DiagonalCross',
              prompt:
                "Generate a floating render of both shoes crossing diagonally in frame, one slightly above the other, angled to show outer sides. Background seamless neutral beige. Lighting crisp, balanced, premium. No outsole bottoms shown. No text, logos, or watermarks.",
            },
            {
              idSuffix: '13',
              name: 'Render_Single_FrontQuarter',
              prompt:
                "Create a floating render of a single shoe at front quarter angle, toe slightly lifted. Background seamless dark grey. Lighting spotlighted but soft around shoe edges. Natural shading below. No outsole bottoms. No text, logos, or watermarks.",
            },
            {
              idSuffix: '14',
              name: 'Render_Pair_SideBySide',
              prompt:
                "Generate a floating render of both shoes side by side, hovering at mid height, angled cleanly to show outer sides. Background seamless white with soft gradient. Balanced daylight style lighting. No outsole bottoms visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '15',
              name: 'Render_Single_DynamicTilt',
              prompt:
                "Create a floating render of a single shoe, dynamic tilt as if in mid-step, toe up slightly. Background seamless light blue. Soft studio light with rim separation. Shadow underneath for realism. No outsole bottoms visible. No text, logos, or watermarks.",
            },
          ],
          'Close-Up Details': [
            {
              idSuffix: '16',
              name: 'Detail_Closeup_LacesEyelets',
              prompt:
                "Create an extreme close up studio shot of the lacing area and eyelets. Focus on stitching, texture, and hardware. Lighting soft directional, background seamless neutral. Crisp macro sharpness. No outsole bottom shown. No text, logos, or watermarks.",
            },
            {
              idSuffix: '17',
              name: 'Detail_Closeup_HeelTab',
              prompt:
                "Generate a macro close up of the heel tab and rear stitching. Emphasize material texture and clean construction. Soft cinematic light, background seamless white. No outsole bottom visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '18',
              name: 'Detail_Closeup_ToeCap',
              prompt:
                "Create a studio close up of the toe cap and front stitching of the shoe. Lighting soft and raking to reveal texture. Background seamless light grey. Focus on craftsmanship. No outsole bottom. No text, logos, or watermarks.",
            },
            {
              idSuffix: '19',
              name: 'Detail_Closeup_SidePanel',
              prompt:
                "Generate a macro detail image of the side panel stitching and material grain. Background seamless neutral white. Directional light with subtle contrast to reveal weave or leather texture. No outsole bottoms. No text, logos, or watermarks.",
            },
            {
              idSuffix: '20',
              name: 'Detail_Closeup_TopDown',
              prompt:
                "Create a top-down close up of the shoe showing laces, tongue, and stitching alignment. Background seamless light neutral. Soft diffused light for clarity. Focus on detail and luxury finish. No outsole bottoms. No text, logos, or watermarks.",
            },
          ],
        },
      },
    },
  },
  female: {
    label: 'Female',
    categories: {
      upper: {
        label: 'Upper Body',
        groups: {
          'Studio Editorials': [
            {
              idSuffix: '01',
              name: 'Studio_Model_FrontPose',
              prompt:
                "Create a premium studio editorial photo showing my garment on a European female model standing front facing with graceful posture. Crop from chin to mid thigh. Background is seamless white or light grey. Lighting is soft and even with a gentle rim to separate the figure. Fabric texture sharp and natural. No text, logos, or watermarks.",
            },
            {
              idSuffix: '02',
              name: 'Studio_Model_SeatedChair',
              prompt:
                "Generate a high fashion studio photo of my garment on a European female model seated elegantly on a minimalist chair. Focus on torso and arms. Crop from waist up. Background is seamless white or light grey. Hands resting gently on lap or lightly touching the garment. Lighting soft and natural to reveal fabric texture. No text, logos, or watermarks.",
            },
            {
              idSuffix: '03',
              name: 'Studio_Model_LeaningWall',
              prompt:
                "Create a cinematic studio editorial of my garment on a European female model leaning elegantly against a smooth neutral wall. Background is seamless white or light grey. Crop waist up. Use directional light across fabric to show weave and folds. Torso fills most of the frame. No text, logos, or watermarks.",
            },
            {
              idSuffix: '04',
              name: 'Studio_Model_AdjustingNeckline',
              prompt:
                "Generate a studio editorial image of my garment on a European female model making a natural gesture by lightly touching the neckline or collar. Crop to upper torso and shoulders only. Background is seamless light grey. Lighting is soft and balanced with even frontal illumination and a subtle rim. Fabric texture is clear and sharp. Hands look elegant and natural. No text, logos, or watermarks.",
            },
            {
              idSuffix: '05',
              name: 'Studio_Model_StepForward',
              prompt:
                "Create a premium studio editorial of my garment on a European female model stepping forward with confidence and elegance. Crop from chest to thigh. Background is seamless white or light grey. Use soft key light with an additional rim. The torso fills most of the frame. Fabric details are sharp and clear. No text, logos, or watermarks.",
            },
          ],
          'Lifestyle Editorials': [
            {
              idSuffix: '06',
              name: 'Lifestyle_Model_StreetNeutral',
              prompt:
                "Generate a lifestyle editorial of my garment on a European female model standing on a minimalist modern street. Neutral toned paving and soft grey architecture blurred behind. Open shade daylight with shallow depth of field. Background muted so garment color stands out. Crop chest up. No text, logos, or watermarks.",
            },
            {
              idSuffix: '07',
              name: 'Lifestyle_Model_BalconyMinimal',
              prompt:
                "Create a lifestyle editorial of my garment on a European female model leaning elegantly on a clean balcony railing. Crop from chest to waist so garment fills the frame. Use golden hour light with shallow depth of field. City background blurred and muted so garment is hero. Fabric folds and fit sharp and detailed. No text, logos, or watermarks.",
            },
            {
              idSuffix: '08',
              name: 'Lifestyle_Model_MinimalArchitecture',
              prompt:
                "Generate a fashion editorial of my garment on a European female model against sleek minimalist architecture. Clean white concrete or travertine wall behind. Soft natural daylight with gentle shadows. Crop waist up. Garment structure and fit emphasized. No text, logos, or watermarks.",
            },
            {
              idSuffix: '09',
              name: 'Lifestyle_Model_SeatedSteps',
              prompt:
                "Create a lifestyle editorial of my garment on a European female model seated gracefully on wide neutral stone steps. Crop torso only. Soft overcast daylight with shallow depth of field. Neutral stone tones muted to emphasize garment. Hands placed elegantly on lap or garment. No text, logos, or watermarks.",
            },
            {
              idSuffix: '10',
              name: 'Lifestyle_Model_WindowLight',
              prompt:
                "Generate a lifestyle editorial of my garment on a European female model near a large modern window with neutral interior background. Soft daylight filters in with subtle rim light. Crop chest up. Light highlights folds and fabric texture. Interior colors muted so garment is focus. No text, logos, or watermarks.",
            },
          ],
          'Studio Close-ups': [
            {
              idSuffix: '11',
              name: 'Studio_Closeup_CollarTexture',
              prompt:
                "Create a studio close up of my garment on a European female model focused on collar and neckline. Background is seamless white or light grey. Raking light reveals stitching and fabric texture. True to life color. No text, logos, or watermarks.",
            },
            {
              idSuffix: '12',
              name: 'Studio_Closeup_FabricFold',
              prompt:
                "Generate a studio close up of my garment sleeve area on a European female model. Show natural folds and fabric texture. Background is seamless white or light grey. Lighting soft and controlled. Macro sharpness on fabric grain. No text, logos, or watermarks.",
            },
            {
              idSuffix: '13',
              name: 'Studio_Closeup_ButtonDetail',
              prompt:
                "Create a studio image of my garment on a European female model cropped mid chest with focus on buttons, zippers, or stitching. Background is seamless white or light grey. Soft cinematic light shows detail without glare. Fabric grain intact. No text, logos, or watermarks.",
            },
            {
              idSuffix: '14',
              name: 'Studio_Closeup_ShoulderStructure',
              prompt:
                "Generate a close up of my garment on a European female model cropped tightly on shoulder line and seam construction. Background is seamless white or light grey. Soft directional light with gentle negative fill. Material texture crisp. No text, logos, or watermarks.",
            },
            {
              idSuffix: '15',
              name: 'Studio_Closeup_CuffDetail',
              prompt:
                "Create a studio close up of my garment sleeve cuff on a European female model. Show stitching, material texture, and tailoring quality. Background is seamless white or light grey. Soft cinematic light. Fabric sharp and detailed. No text, logos, or watermarks.",
            },
          ],
          'Product Hero Shots': [
            {
              idSuffix: '16',
              name: 'Product_Hero_MannequinBag',
              prompt:
                "Create a luxury studio image of my female garment displayed on a minimal mannequin torso. The garment is shown front facing with natural drape and structure. Style the scene with a fashion accessory such as a designer handbag placed neatly beside the mannequin. Background is seamless neutral white or light grey. Lighting is soft and even with gentle rim to highlight fabric texture and craftsmanship. No text, logos, or watermarks.",
            },
            {
              idSuffix: '17',
              name: 'Product_Closeup_Stitching',
              prompt:
                "Create an extreme close up studio shot of my garment showing stitching and seam construction. Use soft directional light to highlight thread detail and layers. Background neutral seamless. No text, logos, or watermarks.",
            },
            {
              idSuffix: '18',
              name: 'Product_Closeup_FabricWeave',
              prompt:
                "Generate a macro image of my garment fabric showing weave and texture in sharp detail. Raking light reveals depth without glare. Background minimal and neutral. No text, logos, or watermarks.",
            },
            {
              idSuffix: '19',
              name: 'Product_Closeup_Fastening',
              prompt:
                "Create a close up studio shot of my garment focusing on a button, zipper, or fastening element. Show stitching and finishing details. Lighting balanced to avoid reflections. Background neutral seamless. No text, logos, or watermarks.",
            },
            {
              idSuffix: '20',
              name: 'Product_Closeup_CuffEdge',
              prompt:
                "Generate a macro shot of my garment sleeve cuff or garment edge. Highlight tailoring, stitching, and craftsmanship. Use soft cinematic light with controlled reflections. Background neutral seamless. No text, logos, or watermarks.",
            },
          ],
        },
      },
      lower: {
        label: 'Lower Body',
        groups: {
          'Studio Editorials': [
            {
              idSuffix: '01',
              name: 'Studio_Model_FrontPose_Clean',
              prompt:
                "Create a premium studio editorial of my female lower body garment on a European female model standing front facing with elegant posture. Crop waist to shoes. Background seamless white or ivory. Lighting soft and even with gentle rim. Fabric fit and texture crisp. Shoes sleek minimal heels. No accessories. No text, logos, or watermarks.",
            },
            {
              idSuffix: '02',
              name: 'Studio_Model_FrontPose_WithBag',
              prompt:
                "Create a studio editorial of my female lower body garment on a European female model standing front facing with refined posture. Crop waist to shoes. Model holds a small structured fashion bag at her side, styled subtly so the pants remain the hero. Background seamless neutral. Lighting soft and refined. Shoes chic heels. Fabric sharp. No text, logos, or watermarks.",
            },
            {
              idSuffix: '03',
              name: 'Studio_Model_SeatedChair_Clean',
              prompt:
                "Generate a studio photo of my female lower body garment while a European female model sits gracefully on a minimalist chair. Legs crossed or angled to highlight drape. Crop waist to shoes. Background seamless neutral. Lighting soft and natural. Shoes elegant but minimal. Focus is fully on garment. No text, logos, or watermarks.",
            },
            {
              idSuffix: '04',
              name: 'Studio_Model_SideProfile_WithBag',
              prompt:
                "Create a studio editorial of my female lower body garment on a European female model in side profile. Crop waist to shoes. Model holds a slim handbag casually at side, adding style but keeping pants dominant. Background seamless ivory. Lighting directional to show drape and leg line. Shoes refined. No text, logos, or watermarks.",
            },
            {
              idSuffix: '05',
              name: 'Studio_Model_StepForward_Clean',
              prompt:
                "Create a studio editorial of my female lower body garment while the European female model steps forward with grace. Crop waist to shoes. Background seamless light neutral. Soft key plus rim lighting. Fabric movement and hem flow clear. Shoes elegant. No accessories. No text, logos, or watermarks.",
            },
          ],
          'Lifestyle Editorials': [
            {
              idSuffix: '06',
              name: 'Lifestyle_Model_Street_Clean',
              prompt:
                "Generate a lifestyle editorial of my female lower body garment on a minimalist modern street. European female model walking naturally. Crop waist to shoes. Neutral paving and muted architecture blurred. Daylight with shallow depth of field. Pants dominant. Shoes chic minimal. No accessories. No text, logos, or watermarks.",
            },
            {
              idSuffix: '07',
              name: 'Lifestyle_Model_Street_WithBag',
              prompt:
                "Generate a lifestyle editorial of my female lower body garment on a European female model walking along a minimalist street. Crop waist to shoes. Model carries a small elegant handbag, styled to complement but not distract. Lighting daylight with shallow depth of field. Garment clearly dominant. Shoes refined. No text, logos, or watermarks.",
            },
            {
              idSuffix: '08',
              name: 'Lifestyle_Model_Balcony_WithBag',
              prompt:
                "Create a lifestyle editorial of my female lower body garment on a European female model leaning elegantly on a balcony railing. Crop waist to shoes. Model holds a fashion handbag resting casually. Golden hour light with shallow depth of field. City blurred. Pants sharp and hero. Shoes chic. No text, logos, or watermarks.",
            },
            {
              idSuffix: '09',
              name: 'Lifestyle_Model_Steps_Clean',
              prompt:
                "Create a lifestyle editorial of my female lower body garment while the European female model sits on wide neutral stone steps. Crop waist to shoes. Hands rest on knees. Lighting overcast, background muted. Pants texture and drape clear. Shoes minimal chic. No accessories. No text, logos, or watermarks.",
            },
            {
              idSuffix: '10',
              name: 'Lifestyle_Model_Walking_WithBag',
              prompt:
                "Generate a lifestyle editorial of my female lower body garment on a European female model mid step. Crop waist to shoes. Model holds a slim handbag at side, styled as an accessory. Soft daylight with crisp shutter motion. Background neutral. Pants flow and hem behavior sharp. Shoes refined. No text, logos, or watermarks.",
            },
          ],
          'Studio Close-ups': [
            {
              idSuffix: '11',
              name: 'Studio_Closeup_Waistband',
              prompt:
                "Create a studio close up of the waistband of my female lower body garment. Show button, zipper, or belt loops clearly. Background seamless ivory or beige. Raking light shows texture and stitching. Colors accurate. No text, logos, or watermarks.",
            },
            {
              idSuffix: '12',
              name: 'Studio_Closeup_Pocket',
              prompt:
                "Generate a studio close up of a pocket detail on my female lower body garment. Show opening, pleats, or stitching. Background seamless neutral. Soft macro lighting. Sharp fabric grain. No text, logos, or watermarks.",
            },
            {
              idSuffix: '13',
              name: 'Studio_Closeup_PleatSeam',
              prompt:
                "Create a studio macro close up of a pleat, crease, or side seam on my female lower body garment. Background seamless neutral. Lighting soft with directional highlight to show depth. Fabric texture clear. No text, logos, or watermarks.",
            },
            {
              idSuffix: '14',
              name: 'Studio_Closeup_FabricTexture',
              prompt:
                "Generate a close up of leg fabric on my female lower body garment, showing softness, sheen, or weave. Background is seamless ivory or white. Soft light with subtle shadows. Texture crisp and realistic. No text, logos, or watermarks.",
            },
            {
              idSuffix: '15',
              name: 'Studio_Closeup_HemDetail',
              prompt:
                "Create a studio close up of the hem or cuff of my female lower body garment. Show stitching and finishing quality. Background seamless neutral. Soft cinematic light. No text, logos, or watermarks.",
            },
          ],
          'Product Hero Shots': [
            {
              idSuffix: '16',
              name: 'Product_Flatlay_Angled',
              prompt:
                "Create a luxury flatlay of my female lower body garment arranged diagonally on a smooth neutral surface. One leg folded for dimension. Camera top down with slight perspective. Soft raking light emphasizes fabric sheen and texture. Subtle gradient shadows. No text, logos, or watermarks.",
            },
            {
              idSuffix: '17',
              name: 'Product_Draped_Premium',
              prompt:
                "Create a luxury studio image of my female lower body garment draped neatly over a minimal pedestal edge. The garment fills most of the frame. Waistband and one leg visible, folds styled cleanly. Background seamless neutral gradient. Lighting directional and refined. No clutter, no text, logos, or watermarks.",
            },
            {
              idSuffix: '18',
              name: 'Product_Closeup_Stitching',
              prompt:
                "Create a macro close up of stitching and seam construction on my female lower body garment. Soft light highlights threads and layers. Background neutral seamless. No text, logos, or watermarks.",
            },
            {
              idSuffix: '19',
              name: 'Product_Closeup_FabricWeave',
              prompt:
                "Generate a macro close up of fabric from my female lower body garment. Show weave, softness, or sheen clearly. Use raking light for depth. Background minimal. No text, logos, or watermarks.",
            },
            {
              idSuffix: '20',
              name: 'Product_Closeup_Hardware',
              prompt:
                "Generate a macro close up of hardware on my female lower body garment, such as zipper, decorative button, or belt loop detail. Show stitching and craftsmanship. Balanced light avoids glare. Background neutral seamless. No text, logos, or watermarks.",
            },
          ],
        },
      },
      footwear: {
        label: 'Footwear',
        groups: {
          'Studio Presentation': [
            {
              idSuffix: '01',
              name: 'Studio_Single_SideProfile_F',
              prompt:
                "Create a premium studio photo of my female footwear in a clean side profile. Single shoe centered on a seamless white or light grey background. Soft diffused lighting with a subtle rim, natural shadow under the sole, accurate color and texture. No text, logos, or watermarks.",
            },
            {
              idSuffix: '02',
              name: 'Studio_Pair_VShape_F',
              prompt:
                "Generate a studio image of both shoes arranged in a slight V shape, toes gently facing inward. Background seamless white or ivory. Balanced daylight style lighting shows silhouette and stitching. No text, logos, or watermarks.",
            },
            {
              idSuffix: '03',
              name: 'Studio_Single_Angled45_F',
              prompt:
                "Create a studio shot of one shoe angled about 45 degrees toward the camera to reveal upper and profile. Seamless neutral background with soft gradient. Double side softboxes for even illumination and gentle speculars. No text, logos, or watermarks.",
            },
            {
              idSuffix: '04',
              name: 'Studio_Pair_Overhead_Diagonal_F',
              prompt:
                "Generate a top-down studio shot of both shoes placed diagonally corner to corner on a seamless white surface. Orthographic feel, light falloff adds depth, shadows soft and minimal. No text, logos, or watermarks.",
            },
            {
              idSuffix: '05',
              name: 'Studio_Single_FrontThreeQuarter_F',
              prompt:
                "Create a studio product photo at front three quarter angle emphasizing toe box, laces, and side panel. Single shoe only. Background light grey with gentle gradient. Lighting soft, premium, true to life color. No text, logos, or watermarks.",
            },
          ],
          'Lifestyle Wear': [
            {
              idSuffix: '06',
              name: 'Lifestyle_Model_StandingCleanNoSocks_F',
              prompt:
                "Generate a lifestyle image of a European female model wearing my footwear, standing naturally with one foot slightly forward. Crop mid calf down so shoes dominate. Bare ankle, no socks. Background modern neutral street softly blurred. No text, logos, or watermarks.",
            },
            {
              idSuffix: '07',
              name: 'Lifestyle_Model_WalkingMidstepNoSocks_F',
              prompt:
                "Create a lifestyle editorial of a European female model walking mid step. Tight crop from knees down with shoes as hero. Bare ankles, no socks. Neutral trousers hem tailored to expose shoe silhouette. Daylight with shallow depth of field. No text, logos, or watermarks.",
            },
            {
              idSuffix: '08',
              name: 'Lifestyle_Model_SeatedBenchNoSocks_F',
              prompt:
                "Generate a lifestyle photo with a European female model seated on a minimalist bench. Legs elegantly crossed or ankles stacked to showcase both shoes. Crop mid calf down; bare ankles. Soft daylight, background muted. Optional accessory such as a small handbag may appear but remains secondary. No text, logos, or watermarks.",
            },
            {
              idSuffix: '09',
              name: 'Lifestyle_Model_StepEdgeNoSocks_F',
              prompt:
                "Create a lifestyle shot of a European female model seated on a step or ledge, one leg bent, one extended. Tight framing on shoes; bare ankle. Golden hour or open shade light for soft highlights. No text, logos, or watermarks.",
            },
            {
              idSuffix: '10',
              name: 'Lifestyle_Model_LowAngleHeroNoSocks_F',
              prompt:
                "Generate a low angle lifestyle product image with a European female model wearing my footwear. Crop knees down, shoes fill most of the frame. Bare ankles, no socks. Background minimalist architecture or muted nature blur. No text, logos, or watermarks.",
            },
          ],
          'Floating Renders': [
            {
              idSuffix: '11',
              name: 'Render_Single_LeftAngle_F',
              prompt:
                "Create a photoreal render of one shoe floating at a left leaning three quarter angle of about 45 degrees. Seamless neutral gradient backdrop. Crisp but soft lighting reveals stitching and materials. No outsole bottom visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '12',
              name: 'Render_Single_RightAngle_F',
              prompt:
                "Generate a floating render of one shoe angled to the right at three quarter view. Background light ivory gradient with soft key and subtle rim. No outsole bottom visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '13',
              name: 'Render_Pair_ParallelFloat_F',
              prompt:
                "Create a floating render with both shoes suspended side by side, slightly offset in depth, showing outer profiles. Background seamless white or ivory gradient. Balanced daylight style lighting. No outsole bottoms visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '14',
              name: 'Render_Pair_DelicateCross_F',
              prompt:
                "Generate a floating render with both shoes gently crossing near the toes for a feminine composition. Background soft pastel gradient with subtle vignette for depth. No outsole bottoms visible. No text, logos, or watermarks.",
            },
            {
              idSuffix: '15',
              name: 'Render_Single_HeroDiagonal_F',
              prompt:
                "Create a floating render of a single shoe in a dynamic diagonal pose with the toe slightly up, emphasizing an elegant silhouette. Background seamless neutral with smooth gradient. Directional soft light with a small contact shadow beneath. No outsole bottoms visible. No text, logos, or watermarks.",
            },
          ],
          'Close-Up Details': [
            {
              idSuffix: '16',
              name: 'Detail_Closeup_LacesEyelets_F',
              prompt:
                "Create an extreme close up of the lacing area and eyelets. Show fine stitching, lace texture, and hardware finish. Soft raking light and seamless neutral background. Macro sharpness. No text, logos, or watermarks.",
            },
            {
              idSuffix: '17',
              name: 'Detail_Closeup_SidePanelTexture_F',
              prompt:
                "Generate a macro close up of the side panel to showcase leather grain, knit weave, or suede nap. Directional light from roughly 35 to 55 degrees enhances texture depth. Background seamless light grey. No text, logos, or watermarks.",
            },
            {
              idSuffix: '18',
              name: 'Detail_Closeup_HeelCollar_F',
              prompt:
                "Create a macro detail of the heel tab and collar showing stitch accuracy, edge finish, and padding. Soft cinematic lighting with gentle falloff; seamless neutral background. No text, logos, or watermarks.",
            },
            {
              idSuffix: '19',
              name: 'Detail_Closeup_ToeBox_F',
              prompt:
                "Generate a close up of the toe box area highlighting material quality and seam alignment. Soft diffused key with negative fill to shape form; neutral seamless background. No text, logos, or watermarks.",
            },
            {
              idSuffix: '20',
              name: 'Detail_Closeup_TongueBranding_F',
              prompt:
                "Create a macro shot of the tongue, lace channel, and subtle branding or emboss. Balanced highlights with a neutral seamless background. Focus on craftsmanship and premium finish. No text, logos, or watermarks.",
            },
          ],
        },
      },
    },
  },
};

const standaloneCategories = {
  sunglasses: {
    label: 'Sunglasses',
    groups: {
      'Male Models': [
        {
          idSuffix: '01',
          name: 'Male_Model_45Deg_Outdoor',
          prompt:
            "Close-up portrait of a European male model wearing my sunglasses at a 45-degree angle outdoors. Sunglasses in sharp focus, face cropped tightly. Warm natural sunlight falling across lenses to reveal gradient color and temple finish. Neutral blurred background. No text, no logos, no extra reflections.",
        },
        {
          idSuffix: '02',
          name: 'Male_Model_45Deg_Urban',
          prompt:
            "European male model in close-up at a 45-degree angle, wearing my sunglasses in an urban setting. Sunglasses clearly visible, framed tightly to face. Natural warm light enhances lens tint and temple color. Background softly blurred. No text or logos.",
        },
        {
          idSuffix: '03',
          name: 'Male_Model_45Deg_Sunset',
          prompt:
            "European male model shown at a 45-degree head turn, wearing my sunglasses with warm sunset light falling across the lenses. Sunglasses in crisp focus, lens color vivid, temples visible. Cropped close to face. No text or logos.",
        },
        {
          idSuffix: '04',
          name: 'Male_Model_Front',
          prompt:
            "Front-facing close-up of a European male model wearing my sunglasses. Sunglasses centered, sharp detail on lenses and temples. Warm daylight illumination with soft gradient shadows across the face. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Male_Model_SideProfile',
          prompt:
            "Side profile close-up of a European male model wearing my sunglasses. Sunglasses fully visible, temples and silhouette highlighted. Soft warm daylight, neutral blurred background. No text or logos.",
        },
      ],
      'Female Models': [
        {
          idSuffix: '06',
          name: 'Female_Model_45Deg_Outdoor',
          prompt:
            "Close-up portrait of a European female model wearing my sunglasses at a 45-degree angle outdoors. Sunglasses dominant, face tightly framed. Warm natural light falling gently across the lenses, showing gradient tint and temple color. Neutral blurred background. No text, logos, or distracting reflections.",
        },
        {
          idSuffix: '07',
          name: 'Female_Model_45Deg_Urban',
          prompt:
            "European female model wearing my sunglasses at a 45-degree angle in an elegant urban setting. Close-up crop, sunglasses in crisp focus. Warm daylight reveals lens color and temples. Background softly blurred. No text or logos.",
        },
        {
          idSuffix: '08',
          name: 'Female_Model_45Deg_Sunset',
          prompt:
            "European female model in close-up at a 45-degree head turn, wearing my sunglasses with sunset light creating warm natural highlights. Sunglasses in sharp focus, color vivid, temples shown. No text or logos.",
        },
        {
          idSuffix: '09',
          name: 'Female_Model_Front',
          prompt:
            "Front-facing close-up portrait of a European female model wearing my sunglasses. Sunglasses centered and dominant. Warm natural light reveals lens gradients and temples. Soft shadows across the face. No text or logos.",
        },
        {
          idSuffix: '10',
          name: 'Female_Model_SideProfile',
          prompt:
            "Side profile close-up of a European female model wearing my sunglasses. Sunglasses clearly visible, temples in focus. Natural daylight with warm tones, background softly blurred. No text or logos.",
        },
      ],
      'Surface Presentation': [
        {
          idSuffix: '11',
          name: 'Surface_Single_Diagonal',
          prompt:
            "Single pair of my sunglasses laid diagonally on a clean neutral matte grey surface. Warm daylight creates natural highlights across lenses. Subtle shadow beneath. No text, logos, or distracting backgrounds.",
        },
        {
          idSuffix: '12',
          name: 'Surface_SideBySide',
          prompt:
            "My sunglasses placed side by side at a slight angle on a clean white surface. Warm sunlight reveals lens tint and temple color. Reflection subtle and elegant. No text or logos.",
        },
        {
          idSuffix: '13',
          name: 'Surface_Single_Angled',
          prompt:
            "Close-up of my sunglasses placed at a three-quarter angle on a neutral beige surface. Warm light highlights the temples and lens gradient. Soft shadows for depth. No text or logos.",
        },
        {
          idSuffix: '14',
          name: 'Surface_Reflection_Glass',
          prompt:
            "My sunglasses laid flat on glossy black glass with a subtle reflection. Warm diffused light reveals lens color and frame details. Clean and premium with no text or logos.",
        },
        {
          idSuffix: '15',
          name: 'Surface_Single_TopDown',
          prompt:
            "Top-down close-up of my sunglasses laid flat on a seamless neutral surface. Sunglasses centered, lenses highlighted by warm daylight. Shadow subtle and natural. No text or logos.",
        },
        {
          idSuffix: '16',
          name: 'Surface_Angled_Close',
          prompt:
            "Single pair of my sunglasses shown at a close-up diagonal angle on a plain surface. Warm sunlight falls across the frame to emphasize temples and gradient lenses. No distracting reflections. No text or logos.",
        },
        {
          idSuffix: '17',
          name: 'Surface_LuxuryPresentation',
          prompt:
            "My sunglasses displayed elegantly on a clean black reflective surface with soft warm sunlight creating natural highlights. Lenses crisp and temples glowing. No text or logos.",
        },
      ],
      'Fashion Detail Close-ups': [
        {
          idSuffix: '18',
          name: 'Detail_Closeup_LensGradient',
          prompt:
            "Extreme close-up of the sunglasses lens showing color gradient and premium finish. Warm natural light reveals lens depth and subtle reflections. Neutral blurred background. No text or logos.",
        },
        {
          idSuffix: '19',
          name: 'Detail_Closeup_TempleAccent',
          prompt:
            "Close-up of the sunglasses temple showing decorative fashion element and premium material. Warm light emphasizes texture and color. Neutral surface beneath. No text or logos.",
        },
        {
          idSuffix: '20',
          name: 'Detail_Closeup_FrontFrame',
          prompt:
            "Close-up of the sunglasses front frame showing silhouette shape and fashion detail. Warm daylight highlights curves and lens tint. Clean neutral background. No text or logos.",
        },
        {
          idSuffix: '21',
          name: 'Detail_Closeup_SideAngle',
          prompt:
            "Extreme close-up from side angle showing both the temple design and lens edge. Warm natural light enhances the premium look. Neutral blurred background. No text or logos.",
        },
        {
          idSuffix: '22',
          name: 'Detail_Closeup_BridgeDesign',
          prompt:
            "Macro detail close-up of the sunglasses bridge design and top frame silhouette. Warm directional light highlights premium contours. Neutral background. No text or logos.",
        },
      ],
    },
  },
  phoneCases: {
    label: 'Phone Cases',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_Front_Elevated',
          prompt:
            "Create a studio product photo of my phone case positioned upright on a minimalist pedestal block. Background is seamless light grey. Soft diffused lighting with a gentle rim highlights case color and texture. Screen is blank neutral. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_Angled_Pair',
          prompt:
            "Generate a studio shot of two of my phone cases leaned against each other at a three-quarter angle on a clean white surface. Warm directional light reveals material finish and camera cut-outs. Shadows soft and controlled. No text, logos, or watermarks.",
        },
        {
          idSuffix: '03',
          name: 'Studio_Flatlay_Array',
          prompt:
            "Create a top-down flatlay of three of my phone cases arranged diagonally on a neutral taupe background. Lighting is even and diffused to showcase colors and texture. Include subtle soft shadows for depth. No text, logos, or watermarks.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_DeskScene',
          prompt:
            "Generate a lifestyle image of my phone case resting on a modern desk beside a laptop and espresso cup. Natural window light with soft shadowing. Colors muted so case is the focal point. No text, logos, or additional devices.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_HandHeld',
          prompt:
            "Create a lifestyle photo showing a hand holding my phone case at a 45-degree angle outdoors. Background softly blurred city street. Golden hour lighting adds warmth while case details stay crisp. No text or logos.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Bedside',
          prompt:
            "Generate a lifestyle shot of my phone case placed on a linen-covered bedside table with a candle and book. Soft morning light entering from the left. Styling minimal so the case remains hero. No text, logos, or screens lit.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_CameraCutout',
          prompt:
            "Create a macro detail of my phone case camera cut-out showing precision edges and raised lip. Background seamless neutral. Use directional light to emphasize contours. No text or logos.",
        },
        {
          idSuffix: '08',
          name: 'Detail_Texture',
          prompt:
            "Generate a macro shot of my phone case material texture, focusing on pattern and finish. Case placed on a neutral matte surface with soft raking light to reveal depth. No text, logos, or device screen.",
        },
        {
          idSuffix: '09',
          name: 'Detail_PortAccess',
          prompt:
            "Create a close-up of my phone case bottom edge showing ports and speaker openings. Background seamless grey. Lighting controlled and diffused for sharp clarity. No text or logos.",
        },
      ],
    },
  },
  hats: {
    label: 'Hats',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_SideProfile',
          prompt:
            "Generate a studio product shot of my hat placed on a minimal stand, side profile angle. Background seamless off-white. Soft diffused lighting with subtle rim to show brim shape and crown texture. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_TopDown',
          prompt:
            "Create a studio top-down shot of my hat resting on a neutral matte surface. Lighting evenly distributed to reveal material grain and panel seams. Soft shadow underneath for depth. No text, logos, or watermarks.",
        },
        {
          idSuffix: '03',
          name: 'Studio_ThreeQuarter',
          prompt:
            "Generate a studio image of my hat at a three-quarter front angle with brim slightly tilted. Background seamless light grey. Cinematic but soft lighting emphasises crown structure and trim detail. No text, logos, or watermarks.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_ModelOutdoor',
          prompt:
            "Create a lifestyle photo of a European model wearing my hat on a minimalist city street. Crop shoulders up. Soft daylight with shallow depth of field so architecture is blurred. Hat color accurate and in focus. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_FlatlayWardrobe',
          prompt:
            "Generate a flatlay of my hat paired with complementary wardrobe pieces (neutral knit, sunglasses) on a textured linen surface. Natural window light from top left with gentle shadows. Styling minimal to keep hat in focus. No text or logos.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Bench',
          prompt:
            "Create a lifestyle shot of my hat resting on a wooden bench beside a coffee cup. Early morning light with warm tones. Background softly blurred. Hat material sharp and true to color. No text or logos.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_BrimStitch',
          prompt:
            "Generate a macro shot of my hat brim, showing stitching and edge binding. Neutral backdrop. Directional light from right emphasises craftsmanship. No text, logos, or additional props.",
        },
        {
          idSuffix: '08',
          name: 'Detail_CrownTexture',
          prompt:
            "Create a macro detail of my hat crown texture and fabric grain. Soft diffused light to highlight tactile quality. Background seamless warm grey. No text or logos.",
        },
        {
          idSuffix: '09',
          name: 'Detail_Label',
          prompt:
            "Generate a close-up of my hat interior sweatband and brand label area. Lighting controlled and even, background blurred neutral. Emphasize quality stitching and materials. No text or logos added beyond the label.",
        },
      ],
    },
  },
  earrings: {
    label: 'Earrings',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_Pair_Hanging',
          prompt:
            "Generate a studio product photo of my earrings hanging from a minimal matte metal stand against a seamless ivory background. Focus sharp on gemstones and metal finish. Lighting soft with subtle highlights, shadows controlled. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_Pair_Flatlay',
          prompt:
            "Create a top-down studio shot of my earrings resting on a neutral stone surface with delicate shadowing. Diffused overhead light to reveal sparkle without harsh reflections. No additional props, text, or logos.",
        },
        {
          idSuffix: '03',
          name: 'Studio_Single_Macro',
          prompt:
            "Generate a macro studio photo of a single earring displayed at a three-quarter angle. Background seamless blush gradient. Lighting focused to reveal facets and metal polish. No text, logos, or watermarks.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_ModelProfile',
          prompt:
            "Create a lifestyle portrait of a European female model wearing my earrings. Crop from temple to collarbone. Background softly blurred neutral interior. Warm window light glancing across earrings to emphasize sparkle. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_VanityFlatlay',
          prompt:
            "Generate a flatlay of my earrings arranged on a marble vanity with minimal cosmetics nearby. Soft morning light from left creating gentle shadows. Colors muted so earrings remain hero. No text, logos, or mirror reflections of camera.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_JewelryBox',
          prompt:
            "Create a lifestyle shot of my earrings resting inside a velvet jewelry box on a wooden dresser. Warm ambient light with a focused highlight on the earrings. Background softly blurred. No text or logos.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_Clasp',
          prompt:
            "Generate a macro detail of my earring clasp showing closure mechanism. Neutral seamless background. Lighting controlled to avoid glare while highlighting metal finish. No text or logos.",
        },
        {
          idSuffix: '08',
          name: 'Detail_Gemstone',
          prompt:
            "Create a macro shot focusing on the primary gemstone of my earring. Background soft gradient. Highlight facets with precise specular highlights. No text, logos, or extra props.",
        },
        {
          idSuffix: '09',
          name: 'Detail_MetalTexture',
          prompt:
            "Generate a macro detail showing the metal texture and engravings on my earring hoop. Soft side light to emphasize depth. Background seamless cool grey. No text or logos.",
        },
      ],
    },
  },
  necklaces: {
    label: 'Necklaces',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_BustForm',
          prompt:
            "Create a studio product photo of my necklace displayed on a matte black bust form against a seamless charcoal background. Soft directional key light from above highlights metal and gemstones, with subtle fill to control shadows. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_Flatlay',
          prompt:
            "Generate a studio flatlay of my necklace arranged in a neat curve on a neutral ivory surface. Diffused overhead light to reveal chain texture and pendant detail. Include gentle shadows for depth. No text, logos, or additional props.",
        },
        {
          idSuffix: '03',
          name: 'Studio_PendantClose',
          prompt:
            "Create a studio close-up of my necklace pendant suspended in front of a soft gradient background. Lighting focused to illuminate stones and metal polish with controlled reflections. No text, logos, or watermarks.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_ModelChest',
          prompt:
            "Generate a lifestyle portrait of a European female model wearing my necklace. Crop from collarbone to mid-chest. Background softly blurred neutral interior. Warm daylight highlights pendant without glare. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_VanityScene',
          prompt:
            "Create a lifestyle image of my necklace draped over a ceramic tray on a vanity with a candle and perfume bottle. Morning window light creates delicate highlights. Palette muted to keep jewelry hero. No text, logos, or reflections of camera.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_GiftBox',
          prompt:
            "Generate a lifestyle shot of my necklace nestled inside an open gift box on a linen surface. Soft ambient light with a subtle spotlight on the pendant. Ribbon and box colors neutral. No text or logos.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_Clasp',
          prompt:
            "Create a macro detail of my necklace clasp and extender chain laid on a neutral matte surface. Lighting directional to reveal craftsmanship. No text, logos, or props.",
        },
        {
          idSuffix: '08',
          name: 'Detail_ChainTexture',
          prompt:
            "Generate a macro shot focusing on the chain texture of my necklace. Background soft gradient. Highlight individual links with diffused light. No text, logos, or watermarks.",
        },
        {
          idSuffix: '09',
          name: 'Detail_PendantGem',
          prompt:
            "Create a macro detail of my necklace pendant gemstone showing facets and setting. Lighting crisp but controlled to avoid hotspots. Background neutral dark grey. No text or logos.",
        },
      ],
    },
  },
  rings: {
    label: 'Rings',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_Stacked',
          prompt:
            "Generate a studio product shot of three of my rings stacked upright on a matte stone block. Background seamless warm grey. Focus sharp on metal and gemstone finishes. Lighting soft with controlled specular highlights. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_SingleMacro',
          prompt:
            "Create a studio macro photo of my ring positioned at a three-quarter angle on a neutral reflective surface. Lighting cinematic yet diffused to show facets without harsh glare. No text, logos, or watermarks.",
        },
        {
          idSuffix: '03',
          name: 'Studio_PairFlatlay',
          prompt:
            "Generate a flatlay of my ring set arranged in a gentle curve on a textured paper background. Soft overhead light casts subtle shadows. No additional props, text, or logos.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_HandClose',
          prompt:
            "Create a lifestyle image of a hand wearing my ring, fingers gently relaxed over a linen surface. Warm natural light from window, shallow depth of field. Skin tones neutral, ring in crisp focus. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_BoxDisplay',
          prompt:
            "Generate a lifestyle shot of my ring presented inside an open velvet ring box atop a marble tray. Soft overhead lighting with gentle highlight on ring. Background blurred neutral décor. No text or logos.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_FlatlayPair',
          prompt:
            "Create a lifestyle flatlay of my ring set beside wedding stationery and florals on a linen background. Natural daylight from left, muted palette so rings stay primary. No text or logos.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_BandEngraving',
          prompt:
            "Generate a macro detail of my ring band showing engraving and interior polish. Background seamless charcoal. Lighting directional to reveal depth. No text or logos.",
        },
        {
          idSuffix: '08',
          name: 'Detail_GemCluster',
          prompt:
            "Create a macro shot focusing on the gemstone cluster setting of my ring. Highlight facets with precise specular lighting. Background dark neutral gradient. No text or logos.",
        },
        {
          idSuffix: '09',
          name: 'Detail_Profile',
          prompt:
            "Generate a side profile macro of my ring showing height of setting and prongs. Background seamless warm grey. Lighting soft but directional for clarity. No text or logos.",
        },
      ],
    },
  },
  bracelets: {
    label: 'Bracelets',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_Coiled',
          prompt:
            "Create a studio product photo of my bracelet coiled neatly on a matte pedestal with seamless light grey background. Diffused key light from above highlights metal or bead texture. Subtle shadow for depth. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_Flatlay',
          prompt:
            "Generate a studio flatlay of my bracelet laid straight across a textured paper surface with slight diagonal placement. Lighting even and soft to reveal material details. No text, logos, or additional props.",
        },
        {
          idSuffix: '03',
          name: 'Studio_Stack',
          prompt:
            "Create a studio shot of multiple bracelets stacked on a clear acrylic cylinder against a seamless white background. Lighting soft but bright to highlight finishes without glare. No text, logos, or watermarks.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_WristClose',
          prompt:
            "Generate a lifestyle image of a wrist wearing my bracelet, resting on a café table with a notebook nearby. Warm natural light, shallow depth of field. Bracelet in sharp focus, surroundings muted. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_FlatlayDesk',
          prompt:
            "Create a lifestyle flatlay of my bracelet arranged with watch and keys on a wooden desk. Soft overhead lighting, neutral palette. Bracelet positioned centrally as hero. No text or logos.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_DisplayTray',
          prompt:
            "Generate a lifestyle image of my bracelet draped across a ceramic jewelry tray with minimal décor. Ambient daylight from side creating gentle highlights. Background softly blurred. No text or logos.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_Clasp',
          prompt:
            "Create a macro detail of my bracelet clasp and jump ring on a neutral matte surface. Lighting directional to emphasize hardware. No text or logos.",
        },
        {
          idSuffix: '08',
          name: 'Detail_BeadTexture',
          prompt:
            "Generate a macro shot focusing on bead or link texture of my bracelet. Background soft gradient. Controlled highlights to show material quality. No text or logos.",
        },
        {
          idSuffix: '09',
          name: 'Detail_Charm',
          prompt:
            "Create a macro detail of the charm element on my bracelet, highlighting engraving. Lighting precise but soft to reveal depth. Background neutral dark. No text or logos.",
        },
      ],
    },
  },
  bags: {
    label: 'Bags',
    groups: {
      'Studio Presentation': [
        {
          idSuffix: '01',
          name: 'Studio_FrontHero',
          prompt:
            "Generate a studio product photo of my bag standing upright front-facing on a seamless light grey background. Soft diffused lighting with subtle rim to define silhouette. Bag centered, shadow controlled. No text, logos, or watermarks.",
        },
        {
          idSuffix: '02',
          name: 'Studio_ThreeQuarter',
          prompt:
            "Create a studio shot of my bag at a three-quarter angle on a minimalist pedestal. Lighting cinematic yet soft to show texture and hardware. Background seamless warm neutral. No text, logos, or watermarks.",
        },
        {
          idSuffix: '03',
          name: 'Studio_Flatlay',
          prompt:
            "Generate a flatlay of my bag with straps arranged neatly on a textured stone surface. Diffused overhead light, gentle shadows for depth. No props beyond a subtle key fob if desired. No text or logos.",
        },
      ],
      'Lifestyle Context': [
        {
          idSuffix: '04',
          name: 'Lifestyle_ModelShoulder',
          prompt:
            "Create a lifestyle image of a European model carrying my bag on shoulder while walking past minimalist architecture. Crop mid torso to mid thigh. Natural daylight, shallow depth of field. Bag in sharp focus, background muted. No text or logos.",
        },
        {
          idSuffix: '05',
          name: 'Lifestyle_CaféTable',
          prompt:
            "Generate a lifestyle scene of my bag placed on a café table beside a coffee cup. Warm morning light through window, soft shadows. Bag angled to showcase hardware. No text or logos.",
        },
        {
          idSuffix: '06',
          name: 'Lifestyle_Bench',
          prompt:
            "Create a lifestyle shot of my bag resting on a park bench with a neutral scarf tucked inside. Overcast daylight, background softly blurred greenery. No text or logos.",
        },
      ],
      'Detail Highlights': [
        {
          idSuffix: '07',
          name: 'Detail_Hardware',
          prompt:
            "Generate a macro detail of my bag hardware and stitching. Background seamless dark neutral. Lighting directional to highlight metal and leather texture. No text or logos.",
        },
        {
          idSuffix: '08',
          name: 'Detail_Interior',
          prompt:
            "Create a close-up of my bag interior showing lining, pockets, and zipper detail. Bag propped open on neutral surface. Soft even lighting for clarity. No text or logos.",
        },
        {
          idSuffix: '09',
          name: 'Detail_Straps',
          prompt:
            "Generate a macro shot focusing on my bag strap attachment and edge paint. Background blurred neutral. Lighting soft but directional to show craftsmanship. No text or logos.",
        },
      ],
    },
  },
};

const MAX_DEFAULT_PROMPTS = 5;

function toTitleCase(value) {
  return value
    .split(/[_\s]+/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function buildPromptId(scope, ownerId, categoryId, suffix, index) {
  const serial = suffix || String(index + 1).padStart(2, '0');
  if (scope === 'gendered') {
    return `${ownerId}-${categoryId}-${serial}`;
  }
  return `${categoryId}-${serial}`;
}

function createDescription(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const sentences = text
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return text.trim();
  }

  let summary = sentences[0];
  if (!summary.endsWith('.')) {
    summary += '.';
  }

  return summary.length > 180 ? `${summary.slice(0, 177)}...` : summary;
}

function createTitle({ title, name, categoryLabel }) {
  if (title) {
    return title;
  }

  const base = name ? toTitleCase(name) : 'Prompt';
  if (!categoryLabel) {
    return base;
  }

  const normalizedCategory = categoryLabel.trim().toLowerCase();
  if (!normalizedCategory) {
    return base;
  }

  return base.toLowerCase().includes(normalizedCategory)
    ? base
    : `${base} (${categoryLabel})`;
}

function normalizeCategory({ scope, ownerId, categoryId, definition }) {
  const groups = [];
  const prompts = [];

  Object.entries(definition.groups || {}).forEach(([groupLabel, groupPrompts = []]) => {
    const normalizedPrompts = groupPrompts.map((entry, index) => {
      const promptId = buildPromptId(scope, ownerId, categoryId, entry.idSuffix, index);
      const record = {
        id: promptId,
        scope,
        ownerId,
        categoryId,
        group: groupLabel,
        name: entry.name,
        title: createTitle({ title: entry.title, name: entry.name, categoryLabel: definition.label }),
        description: entry.description || createDescription(entry.prompt),
        prompt: entry.prompt,
        order: index,
      };
      prompts.push(record);
      return record;
    });

    groups.push({ id: groupLabel, label: groupLabel, prompts: normalizedPrompts });
  });

  const defaultIdsFromDefinition = Array.isArray(definition.defaultPromptSuffixes)
    ? definition.defaultPromptSuffixes
        .map((suffix, index) => buildPromptId(scope, ownerId, categoryId, suffix, index))
        .filter((id) => prompts.some((prompt) => prompt.id === id))
    : [];

  const fallbackDefault = prompts.slice(0, MAX_DEFAULT_PROMPTS).map((prompt) => prompt.id);

  return {
    id: categoryId,
    label: definition.label,
    scope,
    ownerId,
    groups,
    prompts,
    hasPrompts: prompts.length > 0,
    defaultPromptIds: defaultIdsFromDefinition.length > 0 ? defaultIdsFromDefinition : fallbackDefault,
  };
}

const promptsById = {};

const genders = Object.entries(rawCatalog).map(([genderId, genderDefinition]) => {
  const categories = Object.entries(genderDefinition.categories || {}).map(([categoryId, definition]) => {
    const category = normalizeCategory({
      scope: 'gendered',
      ownerId: genderId,
      categoryId,
      definition,
    });
    category.prompts.forEach((prompt) => {
      promptsById[prompt.id] = { ...prompt, genderId };
    });
    return category;
  });

  return {
    id: genderId,
    label: genderDefinition.label,
    categories,
  };
});

const standalone = Object.entries(standaloneCategories).map(([categoryId, definition]) => {
  const category = normalizeCategory({
    scope: 'standalone',
    ownerId: categoryId,
    categoryId,
    definition,
  });
  category.prompts.forEach((prompt) => {
    promptsById[prompt.id] = { ...prompt, genderId: null };
  });
  return category;
});

const genderLookup = Object.fromEntries(genders.map((gender) => [gender.id, gender]));
const standaloneLookup = Object.fromEntries(standalone.map((category) => [category.id, category]));
const categoryLookup = {};

genders.forEach((gender) => {
  gender.categories.forEach((category) => {
    categoryLookup[`${gender.id}:${category.id}`] = category;
  });
});

standalone.forEach((category) => {
  categoryLookup[`standalone:${category.id}`] = category;
});

function getCategory(genderId, categoryId) {
  if (!genderId) {
    return null;
  }
  return categoryLookup[`${genderId}:${categoryId}`] || null;
}

function getStandaloneCategory(categoryId) {
  return standaloneLookup[categoryId] || null;
}

function getPromptsForSelection({ genderId, categoryId }) {
  if (!categoryId) {
    return [];
  }

  if (categoryId === 'sunglasses') {
    const standaloneCategory = getStandaloneCategory(categoryId);
    return standaloneCategory ? standaloneCategory.prompts : [];
  }

  const category = getCategory(genderId, categoryId);
  return category ? category.prompts : [];
}

const catalog = {
  genders,
  standaloneCategories: standalone,
  promptsById,
  genderLookup,
  standaloneLookup,
  categoryLookup,
  getCategory,
  getStandaloneCategory,
  getPromptsForSelection,
};

module.exports = catalog;
module.exports.default = catalog;
