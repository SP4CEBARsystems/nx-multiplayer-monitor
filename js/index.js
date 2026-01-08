import DiskLoader from "./DiskLoader.js";

document.addEventListener('DOMContentLoaded', () => {

    const url1 = 'https://cvws.icloud-content.com/B/AQ3_XlL8v395rMs85zqH5IVNGIm4AXBAq9DavmMpyIXXGUT12yNWaG5o/Disk.nx?o=Anfqal9WEWQ91A6_zzks3qZKmo5Ob3hkFhn8BawhHUZR&v=1&x=3&a=CAogYVyImkBTxU9pIUPdvnmG6W2_2OSC4h0rTdZ1Kvy8rCgSbxCsw5TTuTMYrKDw1LkzIgEAUgRNGIm4WgRWaG5oaifeH1KBTc-PzpZqhyvRfdhLAsKNW6SvQNoyjTCF4zvAg8SgmYbYoEByJ8dHCkPz4ASyB_qXYQL_L2Xapv_kM420ZmKCWv60J9g0XiixZSxENA&e=1767825477&fl=&r=68421def-4da0-4e7f-95ce-1632c27f0b8e-1&k=euj1jCQPJ3VyDSKSTE7GIw&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=127&s=E2l8sh8bEsU-2coDdB-eYIlspOw& =e68fc5bf-021e-463d-9edc-422d33d981b3';
    
    // disk 2 is offline
    const url2 = 'https://cvws.icloud-content.com/B/AW2cWT2PxzWixMKuuNMTHJ8CJ3sHAfxdA46dZplkSEbYVWlIGFW-PFIe/Disk.nx?o=Ahva9W0QBCxM3hVEPoZL4EBgxYzfak2VvmE2gpzL8i89&v=1&x=3&a=CAogP3QI34ZYw-3cegC9FGqWheAWdfajaCIWk9P0kgyrQ3kSbxDq16DTuTMY6rT81LkzIgEAUgQCJ3sHWgS-PFIeaieLDIB2fGh4tWzsATkL0A5aihH4IK7srWZff28kwyT03aV9H_EsP4FyJ9oCbWyH3lWmlwEiR6XDn7zOmmjBf1BP5t6y6xLi1tslBYpUmTOZpw&e=1767825676&fl=&r=1f221210-3789-4f4a-b2a1-04892e75c854-1&k=IIPOi-ixoD1wZFJCWOrmxg&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=128&s=T-CQhUrz6lOK5yTNUnqwVjHGk3Y& =792fc57f-5120-4928-a87d-f2d95c79217b';
    // const disk1RawElement = document.getElementById('disk1-raw');
    // const disk2RawElement = document.getElementById('disk2-raw');
    // if (!disk1RawElement) {
    //     return;
    // }

    const shareUrl1 = 'https://www.icloud.com/iclouddrive/0d2QPN9BYzcp14n6izA1RJweA#Disk';
    const shareUrl2 = 'https://www.icloud.com/iclouddrive/0acjv5mInMtveiYZVbt9UmkyA#Disk';

    // const statusMessages = document.getElementById('status-messages');
    const diskDataSectionElement = document.getElementById('disk-data-section');
    const countdownMessageElement = document.getElementById('countdown-message');
    // if (!statusMessages) {
    //     console.error('no status messages element')
    //     return;
    // }

    const seconds = 1000;
    const loadingInterval = 30 * seconds;

    /**
     * @type {number|undefined}
     */
    let loadingCountdownInterval = undefined;
    /**
     * @type {number}
     */
    let countdownNumber = loadingInterval / seconds;

    const disk1 = new DiskLoader('Disk 1', url1, shareUrl1);
    const disk2 = new DiskLoader('Disk 2', url2, shareUrl2);

    loadAll();
    setInterval(loadAll, loadingInterval);

    function loadAll() {
        if (
            // !statusMessages || 
            !diskDataSectionElement || !countdownMessageElement) {
            return;
        }
        if (loadingCountdownInterval !== undefined) {
            clearInterval(loadingCountdownInterval);
            loadingCountdownInterval = undefined;
            countdownNumber = loadingInterval / seconds;
            countdownMessageElement.textContent = `Refreshing...`
        }
        loadingCountdownInterval = setInterval(
            () => countdownMessageElement.textContent = `Refreshing in ${--countdownNumber}`,
            seconds
        );
        // statusMessages.textContent = 'Loading...';
        Promise.all([disk1.load(), disk2.load()]).then(() => {
            diskDataSectionElement.innerHTML = '';
            disk1.render();
            disk2.render();
            // statusMessages.textContent = '';
        });
    }
    // DataLoading.getString(url1).then(data => {
    //     disk1RawElement.textContent = data ?? "";
    // });
});