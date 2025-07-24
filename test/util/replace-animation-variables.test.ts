import { replaceAnimationVariables } from '../../src/models/wave';
import Wave from '../../src/models/wave';

describe('replaceAnimationVariables', () => {
    it('should replace TRANSLATE_X and ROTATE_Y constants in CSS template', () => {
        // Create a Wave object and manually set the cssMouseTemplate to test our custom template
        const mockWave = new Wave();
        mockWave.cssMouseTemplate = `
@-webkit-keyframes wobble {
  0% { transform: translateX(initial); rotateY(initial); }
  15% { transform: translateX(TRANSLATE_X%); rotateY(ROTATE_Ydeg); }
}

body,iframe {
  font-size: initial;
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: 4s;
  animation-duration: 4s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
`;

        // Test values
        const translationX = "2.5";
        const rotationY = "15.3";

        // Call the function
        const result = replaceAnimationVariables(mockWave, translationX, rotationY);

        // Verify that TRANSLATE_X and ROTATE_Y were replaced
        expect(result).toContain(`translateX(${translationX}%)`);
        expect(result).toContain(`rotateY(${rotationY}deg)`);
        
        // Verify that the original constants are no longer present
        expect(result).not.toContain('TRANSLATE_X');
        expect(result).not.toContain('ROTATE_Y');
        
        // Verify the structure is maintained
        expect(result).toContain('@-webkit-keyframes wobble');
        expect(result).toContain('body,iframe');
        expect(result).toContain('animation-name: wobble');
    });

    it('should handle empty or undefined cssMouseTemplate', () => {
        const mockWave = new Wave();
        mockWave.cssMouseTemplate = undefined;

        const result = replaceAnimationVariables(mockWave, "1.0", "5.0");
        expect(result).toBe("");
    });

    it('should handle multiple occurrences of the same constant', () => {
        const mockWave = new Wave();
        mockWave.cssMouseTemplate = `
@-webkit-keyframes wobble {
  0% { transform: translateX(TRANSLATE_X%); rotateY(ROTATE_Ydeg); }
  15% { transform: translateX(TRANSLATE_X%); rotateY(ROTATE_Ydeg); }
  30% { transform: translateX(TRANSLATE_X%); rotateY(ROTATE_Ydeg); }
}
`;

        const translationX = "3.0";
        const rotationY = "10.0";

        const result = replaceAnimationVariables(mockWave, translationX, rotationY);

        // Count occurrences to ensure all were replaced
        const translateOccurrences = (result.match(new RegExp(`translateX\\(${translationX}%\\)`, 'g')) || []).length;
        const rotateOccurrences = (result.match(new RegExp(`rotateY\\(${rotationY}deg\\)`, 'g')) || []).length;

        expect(translateOccurrences).toBe(3);
        expect(rotateOccurrences).toBe(3);
        
        // Ensure no original constants remain
        expect(result).not.toContain('TRANSLATE_X');
        expect(result).not.toContain('ROTATE_Y');
    });
}); 