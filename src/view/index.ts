import { Events, defaultEventEmitter } from '../events';
import updateInfo from '../update-information.txt';
import ct0View from './ct0.html';
import guestView from './guest.html';
import loggedInView from './logged-in.html';
import style from './style.css';
import updateInfoView from './update-information.html';

// eslint-disable-next-line prettier/prettier
const views = [
    ct0View,
    loggedInView,
    guestView,
    updateInfoView.replace(
        '{{ content }}',
        updateInfo
            .replace('\r', '')
            .split('\n')
            .map(c => `<p>${c}</p>`)
            .join('')
    ),
];

const INTRO_POST = `${document.location.origin}/read.php?tid=1899700`;

const emitter = defaultEventEmitter();

export default function initViews() {
    GM_addStyle(style);
    views.forEach(view => {
        $(view).hide().appendTo(document.body);
    });
    $('#update-information')
        .filter('.gm-btn-open')
        .on('click', () => GM_openInTab(INTRO_POST, false));

    $('.gm-btn-close').on('click', ({ target }) =>
        $(target).parents('.gm-dialog').fadeOut()
    );

    emitter.on(Events.SHOW_UPDATE_INFORMATION, () => {
        $('#update-information').fadeIn();
    });
}
