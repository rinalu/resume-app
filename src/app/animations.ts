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

export const stateChangeAnimation = [
    trigger('stateChange', [
        state('true', style({
            transform:'translate(-150%)'
        })),
        transition('false => true', [
            animate('300ms ease-in')
        ]),
        transition('true => false', [
            animate('300ms ease-in')
        ]),
    ])
];
