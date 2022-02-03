const { time, BN } = require('@openzeppelin/test-helpers');

async function advanceNumBlocks(numberOfBlocks) {
    await time.advanceBlockTo((await time.latestBlock()).add(new BN(numberOfBlocks)));
}

module.exports = { advanceNumBlocks };