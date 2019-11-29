import {
    trigger, transition, animate, style, state
} from '@angular/animations';

export const growthAnimation = [
    // animation triggers
    trigger('startGrowth', [
        transition(':increment', [
            style({opacity: 0}),
            animate('2s ease-in', style({opacity:1}))
        ])
    ])
];
