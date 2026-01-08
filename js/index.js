import DiskInterpret from "./DiskInterpret.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello, DOM content loaded");
    const url1 = 'https://cvws.icloud-content.com/B/AQ3_XlL8v395rMs85zqH5IVNGIm4AXBAq9DavmMpyIXXGUT12yNWaG5o/Disk.nx?o=Anfqal9WEWQ91A6_zzks3qZKmo5Ob3hkFhn8BawhHUZR&v=1&x=3&a=CAogYVyImkBTxU9pIUPdvnmG6W2_2OSC4h0rTdZ1Kvy8rCgSbxCsw5TTuTMYrKDw1LkzIgEAUgRNGIm4WgRWaG5oaifeH1KBTc-PzpZqhyvRfdhLAsKNW6SvQNoyjTCF4zvAg8SgmYbYoEByJ8dHCkPz4ASyB_qXYQL_L2Xapv_kM420ZmKCWv60J9g0XiixZSxENA&e=1767825477&fl=&r=68421def-4da0-4e7f-95ce-1632c27f0b8e-1&k=euj1jCQPJ3VyDSKSTE7GIw&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=127&s=E2l8sh8bEsU-2coDdB-eYIlspOw& =e68fc5bf-021e-463d-9edc-422d33d981b3';
    
    // disk 2 is offline
    const url2 = 'https://cvws.icloud-content.com/B/AW2cWT2PxzWixMKuuNMTHJ8CJ3sHAfxdA46dZplkSEbYVWlIGFW-PFIe/Disk.nx?o=Ahva9W0QBCxM3hVEPoZL4EBgxYzfak2VvmE2gpzL8i89&v=1&x=3&a=CAogP3QI34ZYw-3cegC9FGqWheAWdfajaCIWk9P0kgyrQ3kSbxDq16DTuTMY6rT81LkzIgEAUgQCJ3sHWgS-PFIeaieLDIB2fGh4tWzsATkL0A5aihH4IK7srWZff28kwyT03aV9H_EsP4FyJ9oCbWyH3lWmlwEiR6XDn7zOmmjBf1BP5t6y6xLi1tslBYpUmTOZpw&e=1767825676&fl=&r=1f221210-3789-4f4a-b2a1-04892e75c854-1&k=IIPOi-ixoD1wZFJCWOrmxg&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=128&s=T-CQhUrz6lOK5yTNUnqwVjHGk3Y& =792fc57f-5120-4928-a87d-f2d95c79217b';
    // const disk1RawElement = document.getElementById('disk1-raw');
    // const disk2RawElement = document.getElementById('disk2-raw');
    // if (!disk1RawElement) {
    //     return;
    // }

    const statusMessages = document.getElementById('status-messages');
    if (!statusMessages) {
        console.error('no status messages element')
        return;
    }

    const disk1 = new DiskInterpret('Disk 1', url1);
    const disk2 = new DiskInterpret('Disk 2', url2);

    loadAll();
    const seconds = 1000;
    const loadingInterval = 30 * seconds;
    setInterval(loadAll, loadingInterval);


    function loadAll() {
        if (!statusMessages) {
            return;
        }
        statusMessages.textContent = 'Loading...';
        Promise.all([disk1.load(), disk2.load()]).then(() => {
            disk1.render();
            disk2.render();
            statusMessages.textContent = '';
        });
    }
    // DataLoading.getString(url1).then(data => {
    //     disk1RawElement.textContent = data ?? "";
    // });
});