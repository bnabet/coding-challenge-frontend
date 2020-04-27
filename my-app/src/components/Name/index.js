const Name = props => {
    let nameObj = props.name[0];
    let lastname;

    const prefix = nameObj.prefix ? nameObj.prefix[0] : '';
    const suffix = nameObj.suffix ? nameObj.suffix[0] : '';
    const firstname = nameObj.given ? nameObj.given.join(' ') : '';

    if (nameObj.family) {
        lastname = nameObj.family;
    } else if (nameObj._family) {
        lastname = nameObj._family.extension.map(item => item.valueString).join(' ');
    } else {
        lastname = nameObj.text;
    }

    nameObj = [prefix, suffix, firstname, lastname]
        .filter(item => (item !== undefined) && (item !== ''))
        .join(' ')

    return nameObj;
};

export default Name;