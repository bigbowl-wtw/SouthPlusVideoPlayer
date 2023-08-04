import {
    TwitterCT0Dialog,
    TwitterGuestDialog,
    TwitterLoggedInDialog,
} from './twitter';

const controllers = [
    TwitterCT0Dialog,
    TwitterGuestDialog,
    TwitterLoggedInDialog,
];

export function registerControllers() {
    controllers.forEach(Controller => new Controller());
}
