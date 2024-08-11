
import { Ballot, tally } from '../activatePollListener.function.js';

describe('tally', () => {
    it('should return the only option if there is only one option', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are two options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are three options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option3',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are four options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option3',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        ballots.set('4', {
            userID: '4',
            username: 'user4',
            primarySelection: 'option4',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should return the option with the most votes if there are five options', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option2',
            secondarySelection: 'option1',
            tertiarySelection: 'option3',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option3',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        ballots.set('4', {
            userID: '4',
            username: 'user4',
            primarySelection: 'option4',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        ballots.set('5', {
            userID: '5',
            username: 'user5',
            primarySelection: 'option5',
            secondarySelection: 'option1',
            tertiarySelection: 'option2',
        });
        expect(tally(ballots)).toBe('option1');
    });
    it('should allow for a secondary selection to be the most voted option', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option1',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option4',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option6',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('4', {
            userID: '4',
            username: 'user4',
            primarySelection: 'option8',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        ballots.set('5', {
            userID: '5',
            username: 'user5',
            primarySelection: 'option10',
            secondarySelection: 'option2',
            tertiarySelection: 'option3',
        });
        expect(tally(ballots)).toBe('option2');
    });
    it('should allow for a tertiary selection to be the most voted option', () => {
        const ballots = new Map<string, Ballot>();
        ballots.set('1', {
            userID: '1',
            username: 'user1',
            primarySelection: 'option7',
            secondarySelection: 'option6',
            tertiarySelection: 'option5',
        });
        ballots.set('2', {
            userID: '2',
            username: 'user2',
            primarySelection: 'option9',
            secondarySelection: 'option11',
            tertiarySelection: 'option5',
        });
        ballots.set('3', {
            userID: '3',
            username: 'user3',
            primarySelection: 'option31',
            secondarySelection: 'option12',
            tertiarySelection: 'option5',
        });
        ballots.set('4', {
            userID: '4',
            username: 'user4',
            primarySelection: 'option41',
            secondarySelection: 'option13',
            tertiarySelection: 'option5',
        });
        ballots.set('5', {
            userID: '5',
            username: 'user5',
            primarySelection: 'option51',
            secondarySelection: 'option14',
            tertiarySelection: 'option5',
        });
        ballots.set('6', {
            userID: '6',
            username: 'user6',
            primarySelection: 'option61',
            secondarySelection: 'option22',
            tertiarySelection: 'option5',
        });
        expect(tally(ballots)).toBe('option5');
    });
});