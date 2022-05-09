/* global describe it before ethers */

const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets
} = require('../scripts/libraries/diamond.js')

const { deployDiamond } = require('../scripts/deploy.js')

const { assert } = require('chai')

describe('DiamondTest', async function () {
  let diamondAddress
  let diamondCutFacet
  let diamondLoupeFacet
  let ownershipFacet
  let tx
  let receipt
  let result
  let owner, addr1, addr2, addr3;
  const addresses = []

  before(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    diamondAddress = await deployDiamond()
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress)
    ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress)
  })

  it('should have three facets -- call to facetAddresses function', async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address)
    }

    assert.equal(addresses.length, 3)
  })

  it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
    let selectors = getSelectors(diamondCutFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(diamondLoupeFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(ownershipFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2])
    assert.sameMembers(result, selectors)
  })

  it('selectors should be associated to facets correctly -- multiple calls to facetAddress function', async () => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress('0x1f931c1c')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0xcdffacc6')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0x01ffc9a7')
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress('0xf2fde38b')
    )
  })

  it('should add test1 functions', async () => {
    const Test1Facet = await ethers.getContractFactory('Test1Facet')
    const test1Facet = await Test1Facet.deploy()
    await test1Facet.deployed()
    addresses.push(test1Facet.address)
    const selectors = getSelectors(test1Facet).remove(['supportsInterface(bytes4)'])
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: test1Facet.address,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test1Facet.address)
    assert.sameMembers(result, selectors)
  })

  it('should test function call setStartTime', async () => {
    const test1Facet = await ethers.getContractAt('Test1Facet', diamondAddress)
    await test1Facet.connect(owner).setStartTime();
  })

  it('should test function call getStartTime', async () => {
  
    const test1Facet = await ethers.getContractAt('Test1Facet', diamondAddress)
    let [result, result2] = await test1Facet.connect(owner).getStartTime();
    console.log(result.toString());
    console.log(result2.toString());
  
  })



  it('should replace supportsInterface function', async () => {
    const Test1Facet = await ethers.getContractFactory('Test1Facet')
    const selectors = getSelectors(Test1Facet).get(['supportsInterface(bytes4)'])
    const testFacetAddress = addresses[3]
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: testFacetAddress,
        action: FacetCutAction.Replace,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(testFacetAddress)
    assert.sameMembers(result, getSelectors(Test1Facet))
  })

  it('should add test2 functions', async () => {
    const Test2Facet = await ethers.getContractFactory('Test2Facet')
    const test2Facet = await Test2Facet.deploy()
    await test2Facet.deployed()
    addresses.push(test2Facet.address)
    const selectors = getSelectors(test2Facet).remove(['setStartTime()', 'getStartTime()'])
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: test2Facet.address,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test2Facet.address)
    assert.sameMembers(result, selectors)
  })

  it('should replace setStartTime function', async () => {
    const Test2Facet = await ethers.getContractFactory('Test2Facet')
    const selectors = getSelectors(Test2Facet).get(['setStartTime()'])
    const testFacetAddress = addresses[4]
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: testFacetAddress,
        action: FacetCutAction.Replace,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(testFacetAddress)
    assert.sameMembers(result, getSelectors(Test2Facet).remove(['getStartTime()']))
  })

  it('should replace getStartTime function', async () => {
    const Test2Facet = await ethers.getContractFactory('Test2Facet')
    const selectors = getSelectors(Test2Facet).get(['getStartTime()'])
    const testFacetAddress = addresses[4]
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: testFacetAddress,
        action: FacetCutAction.Replace,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(testFacetAddress)
    assert.sameMembers(result, getSelectors(Test2Facet))
  })

  it('should test function call setStartTime', async () => {
    const test2Facet = await ethers.getContractAt('Test2Facet', diamondAddress)
    await test2Facet.connect(addr1).setStartTime();
  })

  it('should test function call getStartTime', async () => {
  
    const test2Facet = await ethers.getContractAt('Test2Facet', diamondAddress)
    let [result, result2, result3, result4] = await test2Facet.connect(addr1).getStartTime();
    console.log(result.toString());
    console.log(result2.toString());
    console.log(result3.toString());
    console.log(result4.toString());
  
  })

  it('should add test3 functions', async () => {
    const Test3Facet = await ethers.getContractFactory('Test3Facet')
    const test3Facet = await Test3Facet.deploy()
    await test3Facet.deployed()
    addresses.push(test3Facet.address)
    const selectors = getSelectors(test3Facet)
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: test3Facet.address,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test3Facet.address)
    assert.sameMembers(result, selectors)
  })

  it('should test function call increasePoints', async () => {
    const test3Facet = await ethers.getContractAt('Test3Facet', diamondAddress)
    await test3Facet.connect(addr1).increasePoints();
    await test3Facet.connect(addr1).increasePoints();
    await test3Facet.connect(addr1).increasePoints();
  })

  it('should test function call getPoints', async () => {
    const test3Facet = await ethers.getContractAt('Test3Facet', diamondAddress)
    console.log("Points: ", (await test3Facet.connect(addr1).getPoints()).toString());
  })

  it('should add test4 functions', async () => {
    const Test4Facet = await ethers.getContractFactory('Test4Facet')
    const test4Facet = await Test4Facet.deploy()
    await test4Facet.deployed()
    addresses.push(test4Facet.address)
    const selectors = getSelectors(test4Facet)
    let functionCall = test4Facet.interface.encodeFunctionData('initial', [200])
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: test4Facet.address,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      }],
      test4Facet.address, functionCall, { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test4Facet.address)
    assert.sameMembers(result, selectors)
  })

  it('should test function call decreasePoints', async () => {
    const test4Facet = await ethers.getContractAt('Test4Facet', diamondAddress)
    await test4Facet.connect(addr1).decreasePoints();
  })

  it('should test function call getPoints', async () => {
    const test3Facet = await ethers.getContractAt('Test3Facet', diamondAddress)
    console.log("Points: ", (await test3Facet.connect(addr1).getPoints()).toString());
  })

  it('should test function call newIncreasePoints', async () => {
    const test4Facet = await ethers.getContractAt('Test4Facet', diamondAddress)
    await test4Facet.connect(addr1).newIncreasePoints();
  })

  it('should test function call getPoints', async () => {
    const test3Facet = await ethers.getContractAt('Test3Facet', diamondAddress)
    console.log("Points: ", (await test3Facet.connect(addr1).getPoints()).toString());
  })

  
  it('should test function call getInitialzied', async () => {
    const test4Facet = await ethers.getContractAt('Test4Facet', diamondAddress)
    let [result, result2] = await test4Facet.connect(addr1).getInitialzied();
    console.log("Status: ", result.toString());
    console.log("Users: ", result2.toString());
  })

  
})
