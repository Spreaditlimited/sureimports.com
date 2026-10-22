import render from './mailTemplate2';
export const mailTemplate = ({ zTitle, zBodyTitle, zBody }: { zTitle?: string; zBodyTitle?: string; zBody?: string }) => render({ zTitle, zBodyTitle, zBody1: zBody });
export default mailTemplate;
