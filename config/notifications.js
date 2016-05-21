/**
 * /**
 * table:
 *      []: all the regions
 *      [conosle, ...]: console page
 *      [self.profile.<page>, ...]: online user's profile pages <posts|about|followers>
 *          ...
 *          you can get the regions from controller's response
 *
 * condition:
 *      incase set include to [] it returns all the regions
 *      incase set exclude to [] it wont exclude anything
 *
 * @type {*}
 */
module.exports = {
    socketRegion: {
        follow: {
            include: [],
            exclude: []
        },
        normal: {
            include: [],
            exclude: []
        },
    }
};